
const $ = (id) => document.getElementById(id);

const HABITS_KEY = "habithive_habits";
const THEME_KEY = "habithive_dark_mode";

let habits = [];

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftDate(dateString, offset) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + offset);
  return localDateString(date);
}

function loadHabits() {
  try {
    const saved = JSON.parse(localStorage.getItem(HABITS_KEY) || "[]");

    habits = Array.isArray(saved)
      ? saved.filter(h =>
          h &&
          typeof h.id === "string" &&
          typeof h.name === "string" &&
          h.name.trim() &&
          typeof h.category === "string" &&
          typeof h.emoji === "string" &&
          Array.isArray(h.completedDates) &&
          h.completedDates.every(d =>
            typeof d === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(d)
          )
        ).map(h => ({
          ...h,
          completedDates: [...new Set(h.completedDates)]
        }))
      : [];
  } catch {
    habits = [];
  }

  document.body.classList.toggle(
    "dark",
    localStorage.getItem(THEME_KEY) === "true"
  );

  $("themeToggle").textContent =
    document.body.classList.contains("dark") ? "☀" : "☾";
}

function saveHabits() {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

function streakFor(habit, date = localDateString()) {
  let streak = 0;
  let day = date;

  while (habit.completedDates.includes(day)) {
    streak++;
    day = shiftDate(day, -1);
  }

  return streak;
}

function bestStreakFor(habit) {
  const dates = [...new Set(habit.completedDates)].sort();
  let best = 0;
  let current = 0;
  let previous = "";

  for (const date of dates) {
    if (previous && shiftDate(previous, 1) === date) {
      current++;
    } else {
      current = 1;
    }

    best = Math.max(best, current);
    previous = date;
  }

  return best;
}

function getTodayCompleted() {
  const today = localDateString();
  return habits.filter(h => h.completedDates.includes(today)).length;
}

function renderDate() {
  const today = new Date();

  $("todayLabel").textContent = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  $("dateBadge").textContent = today
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
}

function renderProgress() {
  const total = habits.length;
  const completed = getTodayCompleted();
  const percentage = total ? Math.round(completed / total * 100) : 0;

  $("progressPercent").textContent = `${percentage}%`;
  $("progressRing").style.background =
    `conic-gradient(var(--purple) ${percentage}%, #e6e0ef ${percentage}%)`;
  $("progressRing").setAttribute(
    "aria-label",
    `${percentage} percent complete`
  );

  $("completedCount").textContent =
    `${completed} ${completed === 1 ? "habit" : "habits"}`;

  $("habitCount").textContent =
    `${total} ${total === 1 ? "habit" : "habits"}`;

  if (!total) {
    $("progressTitle").textContent = "A fresh start!";
    $("progressText").textContent =
      "Add a habit and begin your journey.";
  } else if (percentage === 100) {
    $("progressTitle").textContent = "You did it! 🎉";
    $("progressText").textContent =
      "Every habit completed. Keep that momentum going!";
  } else if (percentage >= 50) {
    $("progressTitle").textContent = "You're doing great!";
    $("progressText").textContent =
      `${total - completed} more to complete today's routine.`;
  } else {
    $("progressTitle").textContent = "One step at a time.";
    $("progressText").textContent =
      "A small action today builds a better tomorrow.";
  }

  const best = habits.reduce(
    (maximum, habit) => Math.max(maximum, bestStreakFor(habit)),
    0
  );

  $("bestStreak").textContent =
    `${best} ${best === 1 ? "day" : "days"}`;
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function renderHabits() {
  const list = $("habitList");
  list.replaceChildren();

  const today = localDateString();
  $("emptyState").hidden = habits.length > 0;

  habits.forEach(habit => {
    const completed = habit.completedDates.includes(today);
    const card = makeElement(
      "article",
      `habit-card${completed ? " completed" : ""}`
    );

    const icon = makeElement("div", "habit-icon", habit.emoji);

    const info = makeElement("div", "habit-info");
    info.append(
      makeElement("strong", "", habit.name),
      makeElement("small", "", habit.category)
    );

    const streak = streakFor(habit);
    info.append(
      makeElement(
        "span",
        "habit-streak",
        `🔥 ${streak} day${streak === 1 ? "" : "s"} current streak`
      )
    );

    const actions = makeElement("div", "habit-actions");

    const completeButton = makeElement(
      "button",
      "complete-btn",
      completed ? "✓" : ""
    );
    completeButton.type = "button";
    completeButton.setAttribute(
      "aria-label",
      completed
        ? `Mark ${habit.name} incomplete`
        : `Complete ${habit.name}`
    );
    completeButton.setAttribute("aria-pressed", String(completed));

    completeButton.addEventListener("click", () => {
      const index = habit.completedDates.indexOf(today);

      if (index >= 0) {
        habit.completedDates.splice(index, 1);
      } else {
        habit.completedDates.push(today);
      }

      saveHabits();
      renderAll();
    });

    const deleteButton = makeElement("button", "delete-habit", "Delete");
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", `Delete ${habit.name}`);

    deleteButton.addEventListener("click", () => {
      if (!confirm(`Delete the habit "${habit.name}" and its history?`)) {
        return;
      }

      habits = habits.filter(h => h.id !== habit.id);
      saveHabits();
      renderAll();
    });

    actions.append(completeButton, deleteButton);
    card.append(icon, info, actions);
    list.append(card);
  });
}

function renderWeekHistory() {
  const container = $("weekHistory");
  container.replaceChildren();

  const today = localDateString();

  for (let offset = 6; offset >= 0; offset--) {
    const date = shiftDate(today, -offset);
    const completed = habits.filter(h =>
      h.completedDates.includes(date)
    ).length;

    const percentage = habits.length
      ? completed / habits.length
      : 0;

    const column = makeElement("div", "day-column");
    const dateObj = new Date(`${date}T12:00:00`);

    const dayName = dateObj
      .toLocaleDateString("en-US", { weekday: "short" })
      .slice(0, 2);

    const dot = makeElement(
      "div",
      `day-dot${percentage === 1 && habits.length ? " complete" : percentage > 0 ? " has-progress" : ""}`,
      percentage === 1 && habits.length ? "✓" : percentage > 0 ? "•" : "–"
    );

    dot.title = `${completed} of ${habits.length} habits completed`;

    column.append(
      makeElement("span", "day-name", dayName),
      dot,
      makeElement("span", "day-number", String(dateObj.getDate()))
    );

    container.append(column);
  }
}

function renderAll() {
  renderDate();
  renderProgress();
  renderHabits();
  renderWeekHistory();
}

$("habitForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = $("habitName").value.trim();
  const category = $("habitCategory").value;
  const emoji = $("habitEmoji").value;

  if (!name) {
    alert("Please enter a habit name.");
    return;
  }

  if (habits.some(h => h.name.toLowerCase() === name.toLowerCase())) {
    alert("You already have a habit with that name.");
    return;
  }

  habits.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    category,
    emoji,
    completedDates: []
  });

  saveHabits();
  renderAll();

  $("habitForm").reset();
  $("habitName").focus();
});

$("themeToggle").addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");

  localStorage.setItem(THEME_KEY, String(isDark));
  $("themeToggle").textContent = isDark ? "☀" : "☾";
});

loadHabits();
renderAll();
