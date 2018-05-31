function generateTable(rows) {
  return (
    `<table>${rows.map(row => `<tr>${row.map( cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</table>`);
}

module.exports = {
  generateTable
};