const rowsPerPage = 5;
let currentPage = 1;
let allData = [];
let filteredData = [];

Promise.all([
  fetch('./data/lesson_schedule_rows.json').then(r => r.json()),
  fetch('./data/teachers_rows.json').then(r => r.json()),
  fetch('./data/lessons_rows.json').then(r => r.json()),
  fetch('./data/classes_rows.json').then(r => r.json())
]).then(([schedules, teachers, lessons, classes]) => {

  const teacherById = Object.fromEntries(teachers.map(t => [t.id, t]));
  const lessonById  = Object.fromEntries(lessons.map(l => [l.id, l]));
  const classById   = Object.fromEntries(classes.map(c => [c.id, c]));

  allData = schedules.map(s => ({
    day: s.day,
    time: `${formatTime(s.time_start)} – ${formatTime(s.time_end)}`,
    lesson: lessonById[s.lessons_id]?.subject || '-',
    teacher: teacherById[s.teacher_id]?.name || '-',
    class: classById[s.class_id]?.name || '-'
  }));

  filteredData = [...allData];
  renderTable();
});

function renderTable() {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  const start = (currentPage - 1) * rowsPerPage;
  const pageData = filteredData.slice(start, start + rowsPerPage);

  pageData.forEach(row => {
    tbody.innerHTML += `
      <tr class="hover:bg-slate-50">
        <td class="p-3">${row.day}</td>
        <td class="p-3">${row.time}</td>
        <td class="p-3 font-medium">${row.lesson}</td>
        <td class="p-3">${row.teacher}</td>
        <td class="p-3">${row.class}</td>
      </tr>
    `;
  });

  document.getElementById('info').textContent =
    `Halaman ${currentPage} dari ${Math.ceil(filteredData.length / rowsPerPage)}`;
}

document.getElementById('searchInput').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  filteredData = allData.filter(row =>
    Object.values(row).some(v => String(v).toLowerCase().includes(q))
  );
  currentPage = 1;
  renderTable();
});

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

function formatTime(time) {
  return time?.slice(0, 5) || '-';
}
