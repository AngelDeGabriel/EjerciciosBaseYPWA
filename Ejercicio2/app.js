const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
const sidebarBackdrop = document.querySelector(".sidebar-backdrop");
const searchInput = document.querySelector("#project-search");
const projectCards = [...document.querySelectorAll(".project-card")];
const emptySearch = document.querySelector("#empty-search");
const todayDate = document.querySelector("#today-date");

todayDate.textContent = new Intl.DateTimeFormat("es-MX", {
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(new Date()).toLocaleUpperCase("es-MX");

function setMenuOpen(isOpen) {
  sidebar.classList.toggle("is-open", isOpen);
  sidebarBackdrop.hidden = !isOpen;
  sidebar.inert = window.innerWidth <= 820 && !isOpen;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
}

setMenuOpen(false);

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

sidebarBackdrop.addEventListener("click", () => setMenuOpen(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
});

window.addEventListener("resize", () => {
  setMenuOpen(
    window.innerWidth <= 820 && menuToggle.getAttribute("aria-expanded") === "true",
  );
});

document.querySelectorAll(".nav-link, .brand").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 820px)").matches) setMenuOpen(false);
  });
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLocaleLowerCase("es");
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const matches = card.dataset.search.includes(query);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  emptySearch.hidden = visibleCount !== 0;
});

const sectionLinks = [...document.querySelectorAll(".nav-link")];
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleSection) return;

    sectionLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${visibleSection.target.id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  },
  { rootMargin: "-72px 0px -60% 0px", threshold: [0, 0.25, 0.5] },
);

sections.forEach((section) => sectionObserver.observe(section));

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch((error) => {
      console.error("No se pudo registrar el service worker de Nébula.", error);
    });
  });
}
