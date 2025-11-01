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
  table.className = "table table-striped table-bordered align-middle mb-0";

  // Create header
  const thead = document.createElement("thead");
  thead.className = "table-light";
  thead.innerHTML = `
    <tr>
      <th>No</th>
      <th>Product</th>
      <th>Price</th>
      <th>Qty</th>
      <th>Amount</th>
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

    tr.append(no, name, price, qty, amount);
    tbody.appendChild(tr);
  });

  // Assemble the table
  table.append(thead, tbody);
  tableResponsive.appendChild(table);
  orderPreviewContainer.appendChild(tableResponsive);
};

export default OrderItemsViewer;
