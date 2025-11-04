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
 * Renders an order preview table
 * @param {OrderItem[]} orderItems
 * @param {(updatedItem: OrderItem) => void} updateOrderItem 
 * @param {(deletedItemId: number)=> void} deleteItem 
 */
const OrderItemsViewer = (orderItems, updateOrderItem, deleteItem) => {
  const fireDeleteItem = (modal, itemId) => {
    deleteItem(itemId)
    modal.hide();
  }
  const fireSaveChanges = (modal, updated) => {
    updateOrderItem(updated)
    modal.hide();
  }

  const handleQtyInput = (event, item) => {
    /**@type {HTMLInputElement} */
    const amountInput = document.getElementById("editAmount")
    /**@type {HTMLInputElement} */
    const quantityInput = event.target;
    const quantity = Number(quantityInput.value.trim());
    const amount = quantity * item.price;
    amountInput.value = amount;
  }

  const showEditModal = (index) => {
    const item = orderItems[index];
    // Pre-fill modal fields
    /**@type {HTMLInputElement} */
    const qtyInput = document.getElementById("editQuantity");
    qtyInput.addEventListener("input", (event) => handleQtyInput(event, item))
    qtyInput.value = item.quantity;
    const productName = document.getElementById("editProductName")
    productName.value = item.name
    const amountInput = document.getElementById("editAmount")
    amountInput.value = item.quantity * item.price;

    const saveChangesButton = document.getElementById("saveEditBtn");
    const deleteButton = document.getElementById("deleteItemBtn");
    // Store current index in the save/delete buttons
    saveChangesButton.dataset.index = index;
    deleteButton.dataset.index = index;

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById("editItemModal"));
    saveChangesButton.addEventListener("click", () => fireSaveChanges(modal, { ...item, quantity: Number(qtyInput.value) }))
    deleteButton.addEventListener("click", () => fireDeleteItem(modal, item.id))
    modal.show();
  }
  /** @type {HTMLDivElement} */
  const orderPreviewContainer = document.getElementById("order-preview");
  orderPreviewContainer.innerHTML = ""; // clear previous content

  // Create table container
  const tableResponsive = document.createElement("div");
  tableResponsive.className = "table-responsive";

  // Create table
  const table = document.createElement("table");
  table.className = "table table-striped table-bordered align-middle mb-0 order-preview";
  // Define column layout
  const colgroup = document.createElement("colgroup");
  colgroup.innerHTML = `
  <col style="width: 5%;">
  <col style="width: 35%;">
  <col style="width: 15%;">
  <col style="width: 10%;">
  <col style="width: 15%;">
  <col class="not-print" style="width: 10%;">
`;
  table.appendChild(colgroup);

  // Create header
  const thead = document.createElement("thead");
  thead.className = "table-light";
  thead.innerHTML = `
    <tr>
      <th></th>
      <th>Product</th>
      <th>Price</th>
      <th>Qty</th>
      <th>Amount</th>
      <th class="not-print">Edit</th>
    </tr>
  `;

  // Create body
  const tbody = document.createElement("tbody");

  orderItems.forEach((item, index) => {
    const tr = document.createElement("tr");

    const no = document.createElement("td");
    no.textContent = index + 1;

    const name = document.createElement("td");
    name.textContent = item.name;

    const price = document.createElement("td");
    price.textContent = new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 2,
    }).format(item.price);

    const qty = document.createElement("td");
    qty.textContent = item.quantity;

    const amount = document.createElement("td");
    amount.textContent = new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 2,
    }).format(item.amount);

    const actionTd = document.createElement("td");
    const editBtn = document.createElement("button");
    editBtn.addEventListener("click", () => showEditModal(index))
    editBtn.className = "btn btn-sm btn-outline-primary";
    editBtn.textContent = "Edit";
    editBtn.dataset.index = index; // for identifying which item to edit later
    actionTd.appendChild(editBtn);
    tr.append(no, name, price, qty, amount, actionTd);

    tbody.appendChild(tr);
  });

  // Assemble the table
  table.append(thead, tbody);
  tableResponsive.appendChild(table);
  orderPreviewContainer.appendChild(tableResponsive);
};

export default OrderItemsViewer;
