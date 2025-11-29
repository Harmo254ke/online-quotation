
/**
 * @typedef {Object} Quotation
 * @property {number} id
 * @property {string} name
 * @property {string} category
 * @property {number} productUnitId
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

  return rows.map(row => ({
      id: Number(row[0]),
      productUnitId: Number(row[1]),
      name: row[2],
      category: row[3],
      unit: row[4],
      price: Number(row[5]),
  }));
}
