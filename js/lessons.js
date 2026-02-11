const rowsPerPage = 5;
let currentPage = 1;
let originalData = [];
let filteredData = [];

// FETCH & JOIN DATA
Promise.all([
  fetch('./data/lessons_rows.json').then(r => r.json()),
  fetch('./data/lesson_schedule_rows.json').then(r => r.json()),
  fetch('./data/teachers_rows.json').then(r => r.json()),
  fetch('./data/classes_rows.json').then(r => r.json())
]).then(([lessons, schedules, teachers, classes]) => {

  const teacherById = Object.fromEntries(teachers.map(t => [t.id, t]));
  const classById   = Object.fromEntries(classes.map(c => [c.id, c]));
  const lessonById  = Object.fromEntries(lessons.map(l => [l.id, l]));

  // JOIN DATA → FLAT TABLE
  originalData = [];
  lessons.forEach(l => {
    schedules
      .filter(s => s.lessons_id === l.id)
      .forEach(s => {
        originalData.push({
          lesson: l.subject,
          teacher: teacherById[s.teacher_id]?.name || '-',
          class: classById[s.class_id]?.name || '-'
        });
      });
  });

  filteredData = [...originalData];
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
        <td class="p-3 font-medium">${row.lesson}</td>
        <td class="p-3">${row.teacher}</td>
        <td class="p-3">${row.class}</td>
      </tr>
    `;
  });

  document.getElementById('info').textContent =
    `Halaman ${filteredData.length === 0 ? 0 : currentPage} dari ${Math.ceil(filteredData.length / rowsPerPage) || 1}`;
}

// SEARCH
document.getElementById('searchInput').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();

  filteredData = originalData.filter(row =>
    Object.values(row).some(v =>
      String(v).toLowerCase().includes(q)
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
