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

window.addEventListener('load', async () => {
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
  }
  QuotationTable(data, 10, addToOrder);
});


