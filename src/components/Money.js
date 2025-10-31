/**
 * @param {number} value
 * @param {boolean} hideKes
 * @returns {HTMLSpanElement}
 */
const Money = (value, hideKes) => {
  const span = document.createElement("span");
  span.textContent =
    (!hideKes ? "KSh " : "") +
    new Intl.NumberFormat("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  return span;
}
export default Money;
