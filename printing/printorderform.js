document.addEventListener("DOMContentLoaded", () => {
  const orderItems = JSON.parse(localStorage.getItem("orderItems") || "[]");
  const orderDetails = JSON.parse(localStorage.getItem("orderDetails") || "{}");

  // populate school/vendor info
  document.getElementById("school-name").textContent = orderDetails.schoolName || "-";
  document.getElementById("school-town").textContent = orderDetails.schoolTown || "-";
  document.getElementById("school-contact").textContent = orderDetails.schoolContact || "-";
  document.getElementById("vendor-name").textContent = orderDetails.vendorName || "-";
  document.getElementById("vendor-town").textContent = orderDetails.vendorTown || "-";
  document.getElementById("vendor-contact").textContent = orderDetails.vendorContact || "-";

  //additional totals

  // populate order items
  const tbody = document.getElementById("order-items-body");
  let total = 0;
  orderItems.forEach((item, i) => {
    const tr = document.createElement("tr");
    const amount = item.price * item.quantity;
    total += amount;
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${item.sku}</td>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.price.toLocaleString()}</td>
      <td>${amount.toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("order-total").textContent = `KSh ${total.toLocaleString()}`;
  document.getElementById("top-total").textContent = `KSh ${total.toLocaleString()}`;

  // print button
  document.getElementById("print-btn").addEventListener("click", () => window.print());

  document.getElementById("back-btn").addEventListener("click", () => {
    console.log("navigating back");
    window.history.back();
  });
});
