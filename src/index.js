import OrderItemsViewer from "./components/OrderItemsViewer.js";
import QuotationTable from "./components/QuotationTable.js";
import { loadCSV } from "./database/loadCsv.js";
/**
 * @typedef {Object} Quotation
 * @property {number} id
 * @property {string} name
 * @property {string} category
 * @property {string} unit
 * @property {number} price
 */
/**
* @typedef {Object} OrderItem
* @property {number} id
* @property {string} name
* @property {number} price
* @property {number} quantity
* @property {number} amount
*/

/**
  * @param {OrderItem[]} orderItems
  * @param {PointerEvent} event
  */
const printOrder = (event, orderItems) => {
  if (orderItems.length === 0) return;
  console.log("It is not that first now slow")
  /** @type {HTMLButtonElement}*/
  const button = event.target;
  const orderPreview = document.getElementById("order-preview");
  const totalsPrint = document.getElementById("totals-print-button");
  const currentText = button.textContent.trim();
  if (currentText === "go to print page") {
    const printStyle = document.createElement('link');
    printStyle.rel = 'stylesheet';
    printStyle.href = './src/styles/printorderform.css'; // <-- your print-specific stylesheet
    printStyle.media = 'all';
    printStyle.onload = () => {
      button.textContent = "print order form"
      document.body.innerHTML = ""
      document.body.appendChild(orderPreview)
      document.body.appendChild(totalsPrint)
    };
    document.head.appendChild(printStyle);
  } else {
    window.print();
  }
}

/**
  * @param {number[]} amounts
  */
const updateTotal = (amounts) => {
  const newTotal = amounts.reduce((a, b) => a + b, 0)
  const totalViewer = document.getElementById("order-total")
  totalViewer.textContent = newTotal;
}
window.addEventListener('load', async () => {
  /** @type {HTMLButtonElement} */
  const printButton = document.getElementById("print-order-btn");
  const data = await loadCSV()
  /** @type {OrderItem[]} */
  const orderItems = []


  /**
   * @param {Quotation} item
   * @param {number} quantity
   */
  const addToOrder = (item, quantity) => {
    /**
      * @type {OrderItem}
      */
    const orderItem = {
      ...item,
      quantity: quantity,
      amount: quantity * item.price
    }
    orderItems.push(orderItem)
    OrderItemsViewer(orderItems)
    updateTotal(orderItems.map(i => i.amount))
  }

  printButton.onclick = (event) => printOrder(event, orderItems)
  QuotationTable(data, 7, addToOrder);
});





