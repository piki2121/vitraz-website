// Vitraz Studio — shared site behaviour (mobile nav, gallery filter, lightbox)

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initGalleryFilter();
  initLightbox();
  markActiveNavLink();
});

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
  const current = window.location.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current || (href === "/" && current === "")) {
      link.classList.add("active");
    }
  });
}

function initGalleryFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".gallery-item");
  if (!filterButtons.length || !items.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.dataset.filter;
      items.forEach((item) => {
        const matches = category === "all" || item.dataset.category === category;
        item.classList.toggle("visible", matches);
      });
    });
  });
}

function initLightbox() {
  const lightbox = document.querySelector(".lightbox");
  if (!lightbox) return;

  const content = lightbox.querySelector(".lightbox-content");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  document.querySelectorAll("[data-lightbox-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      content.style.background = getComputedStyle(trigger).background;
      content.textContent = trigger.dataset.caption || "";
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
