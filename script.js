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

const openCalendarButtons = document.querySelectorAll("[data-open-calendar]");
const emailInput = document.querySelector("#cta-email");
const infoButtons = document.querySelectorAll("[data-info-request]");
const bookButton = document.querySelector("[data-book-call]");
const calendarGrid = document.querySelector("[data-calendar-grid]");
const calendarMonth = document.querySelector("[data-calendar-month]");
const calendarPrev = document.querySelector("[data-calendar-prev]");
const calendarNext = document.querySelector("[data-calendar-next]");
const calendarTimes = document.querySelector("[data-calendar-times]");
const timeTabs = document.querySelectorAll("[data-time-set]");

const NOXA_EMAIL = "noxadigitalcontact@gmail.com";

const getEmailValue = () => {
  if (!emailInput || !emailInput.value.trim()) {
    return "";
  }
  return emailInput.value.trim();
};

const buildMailto = (subject, body) => {
  const params = new URLSearchParams({
    subject,
    body,
  });
  return `mailto:${NOXA_EMAIL}?${params.toString()}`;
};

const openMailClient = (subject, body) => {
  const mailto = buildMailto(subject, body);
  const link = document.createElement("a");
  link.href = mailto;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
};

if (infoButtons.length > 0) {
  infoButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const email = getEmailValue();
      if (!email) {
        emailInput?.focus();
        alert("Ingresa tu correo para continuar.");
        return;
      }
      const subject = `Mas informacion para "${email}"`;
      const body = `Hola NOXA soy "${email}" y me interesaria saber mas sobre tus servicios.\n\nQuedo atento a su respuesta.\n\nMuchas gracias NOXA,\nHasta pronto!`;
      openMailClient(subject, body);
    });
  });
}

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
  const timeSets = {
    early: ["17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30"],
    late: ["18:45", "19:00", "19:15", "19:30", "19:45"],
  };
  const storageKey = "noxa-calendar-bookings";
  const bookings = JSON.parse(localStorage.getItem(storageKey) || "[]");
  let activeTimeSet = "early";
  let selectedTime = timeSets[activeTimeSet][0];

  const saveBooking = (entry) => {
    bookings.push(entry);
    localStorage.setItem(storageKey, JSON.stringify(bookings));
  };

  const isBooked = (dateKey, time) =>
    bookings.some((entry) => entry.date === dateKey && entry.time === time);

  const clearDates = () => {
    calendarGrid.querySelectorAll(".date").forEach((date) => date.remove());
  };

  const renderTimes = () => {
    if (!calendarTimes) {
      return;
    }
    calendarTimes.innerHTML = "";
    const day = String(state.selected).padStart(2, "0");
    const month = String(state.month + 1).padStart(2, "0");
    const dateKey = `${state.year}-${month}-${day}`;
    const times = timeSets[activeTimeSet];
    if (!times.includes(selectedTime)) {
      selectedTime = times[0];
    }
    times.forEach((time) => {
      const timeBooked = isBooked(dateKey, time);
      const chip = document.createElement("span");
      chip.textContent = time;
      chip.dataset.time = time;
      if (timeBooked) {
        chip.classList.add("unavailable");
      } else if (time === selectedTime) {
        chip.classList.add("active");
      }
      chip.addEventListener("click", () => {
        if (timeBooked) {
          return;
        }
        selectedTime = time;
        renderTimes();
      });
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
      const dateKey = `${state.year}-${String(state.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayIsBooked = Object.values(timeSets).every((set) =>
        set.every((time) => isBooked(dateKey, time))
      );
      const date = document.createElement("span");
      date.className = "date";
      date.textContent = day;
      if (dayIsBooked) {
        date.classList.add("unavailable");
      } else if (day === state.selected) {
        date.classList.add("active");
      }
      date.addEventListener("click", () => {
        if (dayIsBooked) {
          return;
        }
        state.selected = day;
        calendarGrid
          .querySelectorAll(".date")
          .forEach((item) => item.classList.remove("active"));
        date.classList.add("active");
        renderTimes();
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

  timeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const nextSet = tab.dataset.timeSet;
      if (!nextSet || !timeSets[nextSet]) {
        return;
      }
      activeTimeSet = nextSet;
      timeTabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      renderTimes();
    });
  });

  if (bookButton) {
    bookButton.addEventListener("click", () => {
      const email = getEmailValue();
      if (!email) {
        emailInput?.focus();
        alert("Ingresa tu correo para continuar.");
        return;
      }
      const day = String(state.selected).padStart(2, "0");
      const month = String(state.month + 1).padStart(2, "0");
      const dateKey = `${state.year}-${month}-${day}`;
      if (isBooked(dateKey, selectedTime)) {
        return;
      }
      const subject = `Buenas he agendado con vosotros una reunion! de "${email}"`;
      const body = `Hola NOXA soy: "${email}" y me complace anunciaros que he agendado con vosotros una videollamada para saber mas si me interesara vuestro servicio de automatizacion para mi empresa.\n\nNos vemos el dia ${day}/${month}/${state.year} a las ${selectedTime} a traves de Google Meet.\n\nMuchas gracias NOXA,\nHasta pronto!`;
      saveBooking({ date: dateKey, time: selectedTime, email });
      renderCalendar();
      openMailClient(subject, body);
    });
  }
}

openCalendarButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#cta")?.scrollIntoView({ behavior: "smooth" });
    emailInput?.focus();
  });
});

const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}
