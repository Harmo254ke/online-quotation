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
const printOrder = (e, orderItems) => {
  e.preventDefault();

  if (orderItems.length === 0) {
    alert("No order items to print!");
    return;
  }

  localStorage.setItem("orderItems", JSON.stringify(orderItems));

  const modalEl = document.getElementById("orderDetailsModal");
  const form = document.getElementById("orderDetailsForm");
  const modal = new bootstrap.Modal(modalEl);

  //Prefill form if data already exists
  const existingDetails = JSON.parse(localStorage.getItem("orderDetails") || "{}");
  if (Object.keys(existingDetails).length > 0) {
    for (const [key, value] of Object.entries(existingDetails)) {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) input.value = value;
    }
  }

  //Show modal
  modal.show();

  //Handle confirmation
  const confirmBtn = document.getElementById("confirmDetailsBtn");
  confirmBtn.onclick = () => {
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const details = Object.fromEntries(formData.entries());
    localStorage.setItem("orderDetails", JSON.stringify(details));

    modal.hide();

    // Navigate after saving
    const printBtn = e.target;
    window.location.href = printBtn.href;
  };
};


/**
  * @param {number[]} amounts
  */
const updateTotal = (amounts) => {
  const newTotal = amounts.reduce((a, b) => a + b, 0)
  const totalViewer = document.getElementById("order-total")
  totalViewer.textContent = newTotal;
}
window.addEventListener('load', async () => {
  /** @type {HTMLAnchorElement} */
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

  printButton.addEventListener("click", (e) => {
    printOrder(e, orderItems)
  });
  QuotationTable(data, 7, addToOrder);
});





