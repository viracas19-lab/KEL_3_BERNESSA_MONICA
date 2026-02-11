// ===============================
// FETCH SEMUA FILE JSON
// (KECUALI PROFILES)
// ===============================
async function fetchDashboardData() {
  const [
    teachers,
    students,
    classes,
    lessons,
    schedules
  ] = await Promise.all([
    fetch("data/teachers_rows.json").then(r => r.json()),
    fetch("data/students_rows.json").then(r => r.json()),
    fetch("data/classes_rows.json").then(r => r.json()),
    fetch("data/lessons_rows.json").then(r => r.json()),
    fetch("data/lesson_schedule_rows.json").then(r => r.json())
  ]);

  return {
    teachers_rows: teachers,
    students_rows: students,
    classes_rows: classes,
    lessons_rows: lessons,
    lesson_schedule_rows: schedules
  };
}

// ===============================
// RENDER STAT KE CARD
// ===============================
function renderStats(data) {
  document.getElementById("teachers").textContent =
    data.teachers_rows.length;

  document.getElementById("students").textContent =
    data.students_rows.length;

  document.getElementById("classes").textContent =
    data.classes_rows.length;

  document.getElementById("lessons").textContent =
    data.lessons_rows.length;

  document.getElementById("schedules").textContent =
    data.lesson_schedule_rows.length;

  document.getElementById("stats").classList.remove("opacity-60");
}

// ===============================
// INIT DASHBOARD
// ===============================
async function initDashboard() {
  try {
    const data = await fetchDashboardData();
    renderStats(data);
  } catch (error) {
    console.error("Gagal memuat dashboard:", error);
    alert("Data gagal dimuat");
  }
}

initDashboard();
