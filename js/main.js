// Vitraž Studio — shared site behaviour (mobile nav, gallery filter, lightbox)

var GA_MEASUREMENT_ID = "G-KM62J00Z60";

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initGalleryFilter();
  initLightbox();
  initCarousels();
  markActiveNavLink();
  initThemeToggle();
  initLangPrefTracking();
  initCookieConsent();
});

function initCarousels() {
  document.querySelectorAll(".carousel").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const prevBtn = carousel.querySelector(".carousel-prev");
    const nextBtn = carousel.querySelector(".carousel-next");
    if (!track) return;
    const scrollAmount = () => {
      const slide = track.querySelector(".carousel-slide");
      return slide ? slide.getBoundingClientRect().width + 20 : track.clientWidth * 0.8;
    };
    if (prevBtn) prevBtn.addEventListener("click", () => track.scrollBy({ left: -scrollAmount(), behavior: "smooth" }));
    if (nextBtn) nextBtn.addEventListener("click", () => track.scrollBy({ left: scrollAmount(), behavior: "smooth" }));
  });
}

function loadAnalytics() {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.indexOf("XXXX") !== -1) return;
  if (window.__vitrazAnalyticsLoaded) return;
  window.__vitrazAnalyticsLoaded = true;

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
}

function initCookieConsent() {
  const banner = document.querySelector(".cookie-banner");
  if (!banner) return;

  const consent = (() => {
    try {
      return localStorage.getItem("vitraz-cookie-consent");
    } catch (e) {
      return null;
    }
  })();

  if (consent === "accepted") {
    loadAnalytics();
    return;
  }
  if (consent === "declined") {
    return;
  }

  banner.classList.add("visible");

  const acceptBtn = banner.querySelector(".cookie-accept");
  const declineBtn = banner.querySelector(".cookie-decline");

  acceptBtn.addEventListener("click", () => {
    try {
      localStorage.setItem("vitraz-cookie-consent", "accepted");
    } catch (e) {}
    banner.classList.remove("visible");
    loadAnalytics();
  });

  declineBtn.addEventListener("click", () => {
    try {
      localStorage.setItem("vitraz-cookie-consent", "declined");
    } catch (e) {}
    banner.classList.remove("visible");
  });
}

function initLangPrefTracking() {
  document.querySelectorAll(".lang-switch a").forEach((link) => {
    link.addEventListener("click", () => {
      const isHr = link.getAttribute("href").indexOf("/hr") === 0 || link.getAttribute("href") === "/hr";
      try {
        localStorage.setItem("vitraz-lang-pref", isHr ? "hr" : "en");
      } catch (e) {}
    });
  });
}

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

  applyTheme(document.documentElement.getAttribute("data-theme") || "light");

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
  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");
  const triggers = Array.from(document.querySelectorAll("[data-lightbox-trigger]"));
  if (!triggers.length) return;

  let currentIndex = 0;

  function render(index) {
    const trigger = triggers[index];
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
  }

  function openAt(index) {
    currentIndex = (index + triggers.length) % triggers.length;
    render(currentIndex);
    lightbox.classList.add("open");
  }

  triggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => openAt(index));
  });

  if (triggers.length > 1 && prevBtn && nextBtn) {
    prevBtn.hidden = false;
    nextBtn.hidden = false;
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openAt(currentIndex - 1);
    });
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openAt(currentIndex + 1);
    });
  }

  const close = () => lightbox.classList.remove("open");
  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft" && triggers.length > 1) openAt(currentIndex - 1);
    if (e.key === "ArrowRight" && triggers.length > 1) openAt(currentIndex + 1);
  });
}
