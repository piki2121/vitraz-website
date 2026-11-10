// Vitraž Studio — shared site behaviour (mobile nav, gallery filter, lightbox)

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initGalleryFilter();
  initLightbox();
  markActiveNavLink();
  initThemeToggle();
});

function initThemeToggle() {
  const toggle = document.querySelector(".theme-toggle");
  if (!toggle) return;

  const isHr = document.documentElement.lang === "hr";
  const labels = isHr
    ? { toLight: "Prebaci na svijetlu temu", toDark: "Prebaci na tamnu temu" }
    : { toLight: "Switch to light theme", toDark: "Switch to dark theme" };

  const logos = document.querySelectorAll(".logo-img, .footer-logo-img");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    toggle.textContent = theme === "light" ? "☀" : "🌙";
    toggle.setAttribute("aria-label", theme === "light" ? labels.toDark : labels.toLight);
    logos.forEach((img) => {
      img.src = theme === "light" ? "/images/logo-vitraz-black.webp" : "/images/logo-vitraz-cream.webp";
    });
  }

  applyTheme(document.documentElement.getAttribute("data-theme") || "dark");

  toggle.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    try {
      localStorage.setItem("vitraz-theme", next);
    } catch (e) {}
    applyTheme(next);
  });
}

function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => links.classList.remove("open"));
  });
}

function markActiveNavLink() {
  let current = window.location.pathname
    .replace(/index\.html$/, "")
    .replace(/\.html$/, "")
    .replace(/\/$/, "");
  if (current === "") current = "/";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });
}

function initGalleryFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".gallery-item");
  if (!filterButtons.length || !items.length) return;

  function applyFilter(category) {
    filterButtons.forEach((b) => b.classList.toggle("active", b.dataset.filter === category));
    items.forEach((item) => {
      const matches = category === "all" || item.dataset.category === category;
      item.classList.toggle("visible", matches);
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
  });

  const requested = new URLSearchParams(window.location.search).get("filter");
  const validCategories = Array.from(filterButtons, (b) => b.dataset.filter);
  if (requested && validCategories.includes(requested)) {
    applyFilter(requested);
  }
}

function initLightbox() {
  const lightbox = document.querySelector(".lightbox");
  if (!lightbox) return;

  const content = lightbox.querySelector(".lightbox-content");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  document.querySelectorAll("[data-lightbox-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const imageSrc = trigger.dataset.lightboxImage;
      content.innerHTML = "";
      if (imageSrc) {
        content.classList.add("has-image");
        content.style.background = "";
        const img = document.createElement("img");
        img.src = imageSrc;
        img.alt = trigger.dataset.caption || "";
        content.appendChild(img);
      } else {
        content.classList.remove("has-image");
        content.style.background = getComputedStyle(trigger).background;
        content.textContent = trigger.dataset.caption || "";
      }
      lightbox.classList.add("open");
    });
  });

  const close = () => lightbox.classList.remove("open");
  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}
