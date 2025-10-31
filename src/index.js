import { loadCSV } from "./database/loadCsv.js";

window.addEventListener('load', async () => {
  const data = await loadCSV()
  renderTable(data);
});
/**
 * @param {Quotation[]} data
 */
function renderTable(data) {
  const tbody = document.querySelector('#quotation-table tbody');
  tbody.innerHTML = ''; // clear existing rows

  data.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.sku}</td>
      <td>${item.unit}</td>
      <td>${item.price}</td>
    `;
    tbody.appendChild(row);
  });
}
