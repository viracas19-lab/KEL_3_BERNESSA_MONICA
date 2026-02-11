const rowsPerPage = 5;
let currentPage = 1;
let filteredData = [];

// FETCH & JOIN DATA
Promise.all([
  fetch('./data/teachers_rows.json').then(r=>r.json()),
  fetch('./data/lesson_schedule_rows.json').then(r=>r.json()),
  fetch('./data/lessons_rows.json').then(r=>r.json()),
  fetch('./data/classes_rows.json').then(r=>r.json())
]).then(([teachers, schedules, lessons, classes]) => {

  const lessonById = Object.fromEntries(lessons.map(l => [l.id, l]));
  const classById  = Object.fromEntries(classes.map(c => [c.id, c]));

  // JOIN DATA → FLAT TABLE
  filteredData = [];
  teachers.forEach(t => {
    schedules
      .filter(s => s.teacher_id === t.id)
      .forEach(s => {
        filteredData.push({
          nip: t.nip,
          teacher: t.name,
          lesson: lessonById[s.lessons_id]?.subject || '-',
          class: classById[s.class_id]?.name || '-'
        });
      });
  });

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
      <tr class="border-t hover:bg-slate-50">
        <td class="p-3">${row.nip}</td>
        <td class="p-3 font-medium">${row.teacher}</td>
        <td class="p-3">${row.lesson}</td>
        <td class="p-3">${row.class}</td>
      </tr>`;
  });

  document.getElementById('info').textContent =
    `Halaman ${currentPage} dari ${Math.ceil(filteredData.length / rowsPerPage)}`;
}

// SEARCH
document.getElementById('searchInput').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  filteredData = filteredData.filter(row =>
    Object.values(row).some(v => v.toLowerCase().includes(q))
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
