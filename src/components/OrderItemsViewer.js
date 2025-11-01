/**
 * @typedef {Object} OrderItem
 * @property {number} id
 * @property {string} name
 * @property {number} price
 * @property {number} quantity
 * @property {number} amount
 */

/**
 * Renders an order preview table
 * @param {OrderItem[]} orderItems
 */
const OrderItemsViewer = (orderItems) => {
  console.log(JSON.stringify(orderItems))
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
  tbody.className = "small"

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

    const editButton = document.createElement("td")
    editButton.className = "not-print"
    editButton.textContent = "edit"
    tr.append(no, name, price, qty, amount, editButton);

    tbody.appendChild(tr);
  });

  // Assemble the table
  table.append(thead, tbody);
  tableResponsive.appendChild(table);
  orderPreviewContainer.appendChild(tableResponsive);
};

export default OrderItemsViewer;
