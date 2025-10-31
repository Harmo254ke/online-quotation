
/**
 * @typedef {Object} Quotation
 * @property {number} id
 * @property {string} name
 * @property {string} category
 * @property {string} sku
 * @property {string} unit
 * @property {number} price
 */

/**
 * Loads the CSV and returns an array of Quotation objects.
 * @returns {Promise<Quotation[]>}
 */
export async function loadCSV() {
  const response = await fetch('data/quotation.csv');
  const text = await response.text();

  const rows = text.trim().split(/\r?\n/).map(r => r.split(',')).slice(1); // skip header

  /** @type {Quotation[]} */
  const quotation = rows.map(row => ({
    id: Number(row[0]),
    name: row[1],
    category: row[2],
    sku: row[3],
    unit: row[4],
    price: Number(row[5]),
  }));
  return quotation;
}
