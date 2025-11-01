import Money from "./Money.js";

/**
 * @typedef {Object} Quotation
 * @property {number} id
 * @property {string} name
 * @property {string} category
 * @property {string} unit
 * @property {number} price
 */

/**
  * @param {string} quantityId
  * @param {string} amountId
  * @param {number} price
  */
const calculateAmount = (quantityId, amountId, price) => {
  /** @type {HTMLInputElement} */
  const inputElement = document.getElementById(quantityId);
  const label = document.getElementById(amountId);
  label.innerHTML = ""

  const quantity = Number(inputElement.value.trim());
  if (quantity === 0) {
    label.textContent = "invalid quantity"
    return;
  }
  const amount = quantity * price;
  const money = Money(amount, false);
  label.appendChild(money)
}

/**
  * @param {PointerEvent} event
  */
const changeInnerText = (event) => {
  const button = event.target;
  const text = button.textContent;
  button.textContent = text === "Add" ? "Close" : "Add";
}
/**
  * @param {HTMLButtonElement} addButton
  */

const cancel = (addButton) => {
  addButton.textContent = "Add"
}

/**
 * Renders paginated table
 * @param {Quotation[]} data
 * @param {number} pageSize
  *@param {(quotation: Quotation, quantity: number) => void} addToOrderForm
 */
const QuotationTable = (data, pageSize, addToOrderForm) => {
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
    * @param {HTMLButtonElement} addButton
    * @param {string} quantityId
    * @param {Quotation} item
    */
  const confirm = (addButton, quantityId, item) => {
    /** @type {HTMLInputElement} */
    const quantityInput = document.getElementById(quantityId);
    const quantity = Number(quantityInput.value.trim())
    if (quantity === 0) return;
    addToOrderForm(item, quantity)
  }


  /**
   * Renders paginated table
    *@param {HTMLTableSectionElement} tbody
   * @param {number} currentPage 
   * @param {number} totalPages 
   * @param {HTMLUListElement} pagination 
   */

  function renderPage(tbody, currentPage, totalPages, pagination) {
    tbody.innerHTML = '';

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const rows = data.slice(start, end);

    rows.forEach((item, index) => {
      const row = document.createElement('tr');
      const rowId = `collapse-${item.id}`

      // id (hidden)
      const tdId = document.createElement("td");
      tdId.hidden = true;
      tdId.textContent = item.id;

      // No
      const tdNo = document.createElement("td");
      tdNo.textContent = index + 1;

      // Name
      const tdName = document.createElement("td");
      tdName.textContent = item.name;

      // Category
      const tdCategory = document.createElement("td");
      tdCategory.textContent = item.category;

      // Unit
      const tdUnit = document.createElement("td");
      tdUnit.textContent = item.unit;

      // Price (use your Money component)
      const tdPrice = document.createElement("td");
      tdPrice.appendChild(Money(item.price, false));

      // Action button
      const tdAction = document.createElement("td");
      /** @type {HTMLButtonElement} */
      const addBtn = document.createElement("button");
      addBtn.className = "btn btn-sm p-1 m-0 btn-outline-primary";
      addBtn.setAttribute("data-bs-toggle", "collapse");
      addBtn.setAttribute("data-bs-target", `#${rowId}`);
      addBtn.setAttribute("aria-expanded", "false");
      addBtn.setAttribute("aria-controls", rowId);
      addBtn.onclick = (event) => changeInnerText(event);
      addBtn.textContent = "Add";
      tdAction.appendChild(addBtn);

      // Append all <td> to <tr>
      row.append(
        tdId,
        tdNo,
        tdName,
        tdCategory,
        tdUnit,
        tdPrice,
        tdAction
      );

      const expandRow = document.createElement("tr");
      expandRow.id = rowId;
      expandRow.className = "collapse"
      const amountLabelId = `amount-${item.id}`;
      const quantityInputId = `quantity-${item.id}`;

      // Create the main cell
      const cell = document.createElement("td");
      cell.colSpan = 6;
      cell.className = "bg-light";

      // Create container div
      const container = document.createElement("div");
      container.className = "d-flex flex-wrap align-items-center gap-2 p-2";

      // Label: Quantity
      const quantityLabel = document.createElement("label");
      quantityLabel.className = "form-label mb-0";
      quantityLabel.textContent = "Quantity:";

      // Input: Quantity
      const input = document.createElement("input");
      input.type = "number";
      input.min = "1";
      input.placeholder = "Enter quantity";
      input.className = "form-control w-auto";
      input.id = quantityInputId;
      input.oninput = () => calculateAmount(quantityInputId, amountLabelId, item.price);

      // Button: Confirm
      const confirmBtn = document.createElement("button");
      confirmBtn.className = "btn btn-success btn-sm";
      confirmBtn.onclick = () => confirm(addBtn, quantityInputId, item);
      confirmBtn.textContent = "Confirm";

      // Button: Cancel
      const cancelBtn = document.createElement("button");
      cancelBtn.className = "btn btn-outline-secondary btn-sm";
      cancelBtn.setAttribute("data-bs-toggle", "collapse");
      cancelBtn.setAttribute("data-bs-target", `#${rowId}`);
      cancelBtn.onclick = () => cancel(addBtn)
      cancelBtn.textContent = "Cancel";

      // Label: Amount
      const amountLabel = document.createElement("label");
      amountLabel.id = amountLabelId;
      amountLabel.className = "fw-semibold text-primary ms-2";

      // Append everything
      container.appendChild(quantityLabel);
      container.appendChild(input);
      container.appendChild(confirmBtn);
      container.appendChild(cancelBtn);
      container.appendChild(amountLabel);
      cell.appendChild(container);
      expandRow.appendChild(cell); tbody.appendChild(row);
      tbody.appendChild(expandRow)
    });
    renderPagination(pagination, totalPages, currentPage, tbody);
  }
  /**
   * Renders paginated table
    *@param {HTMLTableSectionElement} tbody
   * @param {number} currentPage 
   * @param {number} totalPages 
   * @param {HTMLUListElement} pagination 
   */

  function renderPagination(pagination, totalPages, currentPage, tbody) {
    pagination.innerHTML = '';

    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Page navigation');

    const ul = document.createElement('ul');
    ul.className = 'pagination justify-content-center flex-wrap';

    // Helper for page buttons
    const createPageButton = (label, page, disabled = false, active = false) => {
      const li = document.createElement('li');
      li.className = `page-item ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`;
      const btn = document.createElement('button');
      btn.className = 'page-link';
      btn.textContent = label;
      if (!disabled) {
        btn.addEventListener('click', () =>
          renderPage(tbody, page, totalPages, pagination)
        );
      }
      li.appendChild(btn);
      return li;
    };

    // Previous
    ul.appendChild(createPageButton('Previous', currentPage - 1, currentPage === 1));

    // Determine visible page range
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);

    for (let i = start; i <= end; i++) {
      ul.appendChild(createPageButton(i, i, false, i === currentPage));
    }

    // Next
    ul.appendChild(createPageButton('Next', currentPage + 1, currentPage === totalPages));

    nav.appendChild(ul);
    pagination.appendChild(nav);
  }
}
export default QuotationTable;
