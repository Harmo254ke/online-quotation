import { loadCSV } from "./database/loadCsv.js";

window.addEventListener('load', async () => {
  const data = await loadCSV()
  TableComponent(data, 10);
});

/**
 * Renders paginated table
 * @param {Quotation[]} data
 * @param {number} pageSize
 */
const TableComponent = (data, pageSize) => {
  let currentPage = 1;
  /** @type {number} */
  const totalPages = Math.ceil(data.length / pageSize);
  /** @type {HTMLTableSectionElement} */
  const tbody = document.getElementById('quotation-body');
  /** @type {HTMLUListElement} */
  const pagination = document.getElementById('pagination');

  // First time load: first page by default, 'useEffect'
  renderPage(tbody, currentPage, totalPages, pagination, pageSize, data);

  /**
   * Renders paginated table
    *@param {HTMLTableSectionElement} tbody
   * @param {number} currentPage 
   * @param {number} pageSize 
   * @param {Quotation[]} data
   * @param {number} totalPages 
   * @param {HTMLUListElement} pagination 
   */

  function renderPage(tbody, currentPage, totalPages, pagination, pageSize, data) {
    tbody.innerHTML = '';

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const rows = data.slice(start, end);

    rows.forEach(item => {
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
    renderPagination(pagination, totalPages, currentPage, tbody, pageSize, data);
  }
  /**
   * Renders paginated table
    *@param {HTMLTableSectionElement} tbody
   * @param {number} currentPage 
   * @param {number} pageSize 
   * @param {Quotation[]} data
   * @param {number} totalPages 
   * @param {HTMLUListElement} pagination 
   */
  function renderPagination(pagination, totalPages, currentPage, tbody, pageSize, data) {
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement('li');
      li.className = `page-item ${i === currentPage ? 'active' : ''}`;
      const btn = document.createElement('button');
      btn.className = 'page-link';
      btn.textContent = i;
      //Render on button click
      btn.addEventListener('click', () => renderPage(tbody, i, totalPages, pagination, pageSize, data));
      li.appendChild(btn);
      pagination.appendChild(li);
    }
  }
}

