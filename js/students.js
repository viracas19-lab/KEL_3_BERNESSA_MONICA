const rowsPerPage = 5;
let currentPage = 1;
let allData = [];
let filteredData = [];

// FETCH DATA
Promise.all([
  fetch('./data/students_rows.json').then(r => r.json()),
  fetch('./data/classes_rows.json').then(r => r.json())
]).then(([students, classes]) => {

  const classById = Object.fromEntries(
    classes.map(c => [c.id, c])
  );

  // JOIN DATA
  allData = students.map(s => ({
    nis: s.nis,
    name: s.name,
    class: classById[s.class_id]?.name || '-'
  }));

  filteredData = [...allData];
  renderTable();
});

// RENDER TABLE
function renderTable() {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  const start = (currentPage - 1) * rowsPerPage;
  const pageData = filteredData.slice(start, start + rowsPerPage);

  pageData.forEach(row => {
    tbody.innerHTML += `
      <tr class="hover:bg-slate-50">
        <td class="p-3">${row.nis}</td>
        <td class="p-3 font-medium">${row.name}</td>
        <td class="p-3">${row.class}</td>
      </tr>
    `;
  });

  document.getElementById('info').textContent =
    `Halaman ${currentPage} dari ${Math.max(
      1,
      Math.ceil(filteredData.length / rowsPerPage)
    )}`;
}

// SEARCH
document.getElementById('searchInput').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();

  filteredData = allData.filter(row =>
    Object.values(row).some(v =>
      v.toLowerCase().includes(q)
    )
  );

  currentPage = 1;
  renderTable();
});

// PAGINATION
document.getElementById('prevBtn').onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
};

document.getElementById('nextBtn').onclick = () => {
  if (currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
    currentPage++;
    renderTable();
  }
};
