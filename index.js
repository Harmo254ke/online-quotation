import OrderItemsViewer from "./components/OrderItemsViewer.js";
import QuotationTable from "./components/QuotationTable.js";
import { loadCSV } from "./database/loadCsv.js";
/**
 * @typedef {Object} Quotation
 * @property {number} id
 * @property {string} name
 * @property {string} sku
 * @property {string} category
 * @property {string} unit
 * @property {number} price
 */
/**
* @typedef {Object} OrderItem
* @property {number} id
* @property {string} name
* @property {string} sku
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
  /**@type{Quotation[]} */
  const data = await loadCSV()

  /**
 * Generic search helper — ranks and limits results
 * @param {string} query - Search text
 * @param {'name' | 'category'} field - Field to search by
 */
  const searchData = (query, field) => {
    // Normalize search
    const q = query.toLowerCase();


    // Filter and rank loosely (substring match)
    const ranked = data
      .map(item => {
        const value = (item[field] || "").toLowerCase();
        const index = value.indexOf(q);
        return {
          item,
          rank: index === -1 ? Infinity : index,
        };
      })
      .filter(r => r.rank !== Infinity)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 7)
      .map(r => r.item);

    // Re-render results only (don’t mutate `data`)
    QuotationTable(ranked, 7, addToOrder);
  };

  // wrappers for convenience
  const searchByName = (name) => searchData(name, "name");
  const searchByCategory = (category) => searchData(category, "category");

  const performSearch = (param) => {
    if (param === "") return;
    /** @type{HTMLSelectElement} */
    const searchType = document.getElementById("search-type");
    const searchBy = searchType.value.trim();
    if (searchBy === "name") {
      searchByName(param);
    } else if (searchBy === "category") {
      searchByCategory(param);
    }
  }

  const search = () => {
    /** @type{HTMLInputElement} */
    const searchInput = document.getElementById("search-input");
    const param = searchInput.value.trim();
    performSearch(param)
  }

  const searchOnKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // prevent form submission if inside a form
      const param = event.target.value.trim();
      performSearch(param)
    }
  };
  /** @type{HTMLInputElement} */
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("keydown", (event) => searchOnKeyDown(event))
  /** @type{HTMLButtonElement} */
  const searchButton = document.getElementById("search-btn");
  searchButton.addEventListener("click", () => search());

  /** @type {OrderItem[]} */
  let orderItems = []


  const updateOrderItem = (updated) => {
    orderItems = orderItems.map(item => {
      if (item.id === updated.id) {
        return updated;
      } else {
        return item;
      }
    });

    OrderItemsViewer(orderItems, updateOrderItem, deleteItem)
    updateTotal(orderItems.map(i => i.amount))

    localStorage.setItem("orderItems", JSON.stringify(orderItems));
  }
  const deleteItem = (deletedId) => {
    console.log(`Delete item with id: ${deletedId}`)
    orderItems = orderItems.filter(item => {
      return item.id !== deletedId;
    });

    OrderItemsViewer(orderItems, updateOrderItem, deleteItem)
    updateTotal(orderItems.map(i => i.amount))

    localStorage.setItem("orderItems", JSON.stringify(orderItems));
  }
  /** @type {OrderItem[]} */
  const localStorageOrderItems = JSON.parse(localStorage.getItem("orderItems") || "[]");
  if (localStorageOrderItems.length > 0) {
    orderItems = localStorageOrderItems;
    OrderItemsViewer(orderItems, updateOrderItem, deleteItem)
    updateTotal(orderItems.map(i => i.amount))
  }

  /**
   * @param {Quotation} item
   * @param {number} quantity
   */
  function addToOrder(item, quantity) {
    /**
      * @type {OrderItem}
      */
    const orderItem = {
      ...item,
      quantity: quantity,
      amount: quantity * item.price
    }
    const existsId = orderItems.findIndex(i => {
      return i.id === orderItem.id
    });
    if (existsId > -1) {
      const existingItem = orderItems[existsId];
      const newQuantity = existingItem.quantity + orderItem.quantity;
      const updatedItem = { ...existingItem, quantity: newQuantity, amount: newQuantity * orderItem.price }
      orderItems[existsId] = updatedItem;
    } else {
      orderItems.push(orderItem)
    }
    OrderItemsViewer(orderItems, updateOrderItem, deleteItem)
    localStorage.setItem("orderItems", JSON.stringify(orderItems));
    updateTotal(orderItems.map(i => i.amount))
  }

  printButton.addEventListener("click", (e) => {
    printOrder(e, orderItems)
  });
  QuotationTable(data, 7, addToOrder);
  document.getElementById("refresh-btn").addEventListener("click", () => {
    QuotationTable(data, 7, addToOrder);
  });


  document.getElementById("clear-order-btn").addEventListener("click", () => {
    const localStorageOrderItems = JSON.parse(localStorage.getItem("orderItems") || "[]");
    if (localStorageOrderItems.length === 0 && orderItems.length === 0) return;
    if (confirm("Are you sure you want to clear the current order?")) {
      orderItems = []
      localStorage.removeItem("orderItems");
      document.getElementById("order-preview").innerHTML = "No order items added";
      document.getElementById("order-total").textContent = "KSh 0.00";
    }
  });
});





