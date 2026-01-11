const items = document.querySelectorAll(".accordion-item");

items.forEach((item) => {
  item.addEventListener("click", () => {
    const isActive = item.classList.contains("active");
    items.forEach((other) => other.classList.remove("active"));
    if (!isActive) {
      item.classList.add("active");
    }
  });
});

const calendarGrid = document.querySelector("[data-calendar-grid]");
const calendarMonth = document.querySelector("[data-calendar-month]");
const calendarPrev = document.querySelector("[data-calendar-prev]");
const calendarNext = document.querySelector("[data-calendar-next]");
const calendarTimes = document.querySelector("[data-calendar-times]");

if (calendarGrid && calendarMonth && calendarPrev && calendarNext) {
  const monthNames = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const startState = new Date(2026, 0, 1);
  const state = {
    year: startState.getFullYear(),
    month: startState.getMonth(),
    selected: 13,
  };
  const times = ["19:00", "19:15", "19:30", "19:45", "20:00"];

  const clearDates = () => {
    calendarGrid.querySelectorAll(".date").forEach((date) => date.remove());
  };

  const renderTimes = () => {
    if (!calendarTimes) {
      return;
    }
    calendarTimes.innerHTML = "";
    times.forEach((time) => {
      const chip = document.createElement("span");
      chip.textContent = time;
      calendarTimes.appendChild(chip);
    });
  };

  const renderCalendar = () => {
    clearDates();
    const firstDay = new Date(state.year, state.month, 1);
    const lastDay = new Date(state.year, state.month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7;
    calendarMonth.textContent = `${monthNames[state.month]} ${state.year}`;

    for (let i = 0; i < startOffset; i += 1) {
      const empty = document.createElement("span");
      empty.className = "date empty";
      calendarGrid.appendChild(empty);
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      const date = document.createElement("span");
      date.className = "date";
      date.textContent = day;
      if (day === state.selected) {
        date.classList.add("active");
      }
      date.addEventListener("click", () => {
        state.selected = day;
        calendarGrid
          .querySelectorAll(".date")
          .forEach((item) => item.classList.remove("active"));
        date.classList.add("active");
      });
      calendarGrid.appendChild(date);
    }
  };

  calendarPrev.addEventListener("click", () => {
    state.month -= 1;
    if (state.month < 0) {
      state.month = 11;
      state.year -= 1;
    }
    state.selected = 1;
    renderCalendar();
  });

  calendarNext.addEventListener("click", () => {
    state.month += 1;
    if (state.month > 11) {
      state.month = 0;
      state.year += 1;
    }
    state.selected = 1;
    renderCalendar();
  });

  renderTimes();
  renderCalendar();
}
