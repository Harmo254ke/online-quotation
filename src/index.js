import QuotationTable from "./components/QuotationTable.js";
import { loadCSV } from "./database/loadCsv.js";

window.addEventListener('load', async () => {
  const data = await loadCSV()
  QuotationTable(data, 10);
});


