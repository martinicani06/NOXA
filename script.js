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
