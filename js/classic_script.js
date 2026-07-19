/* =============== RENDER FROM SHARED DATA (js/data.js) =============== */
document.addEventListener("DOMContentLoaded", () => {
  // Contact buttons
  const phoneBtn = document.getElementById("phone-btn");
  phoneBtn.href = `tel:${PROFILE.phone.replace(/\s/g, "")}`;
  document.getElementById("phone-text").textContent = PROFILE.phone;
  document.getElementById("mail-btn").href = `mailto:${PROFILE.email}`;

  // Share URL input
  document.getElementById("shareUrl").value = PROFILE.url;

  // Social links list
  const list = document.getElementById("links-list");
  LINKS.forEach((link, i) => {
    const li = document.createElement("li");
    li.className = "mb-3 animate__animated animate__bounceIn";
    li.style.animationDelay = `${0.2 + i * 0.2}s`;
    li.innerHTML = `
      <a href="${link.url}" target="_blank" class="btn btn-dark d-flex align-items-center p-3 rounded-3 text-start">
        <i class="${link.icon} me-3"></i>
        <div class="text-start">
          <h5 class="mb-0">${link.name}</h5>
          <small>${link.desc}</small>
        </div>
      </a>`;
    list.appendChild(li);
  });
});

/* =============== LIGHT MODE =============== */
const toggleButton = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const favicon = document.getElementById("favicon");

// Function to set favicon based on system theme
function setFaviconBasedOnSystemTheme() {
  const isSystemLight = window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches;
  favicon.href = isSystemLight
    ? "assets/images/favicon-light.svg"
    : "assets/images/favicon-dark.svg";
}

// Set the favicon on page load
setFaviconBasedOnSystemTheme();

// Listen for system theme changes
window
  .matchMedia("(prefers-color-scheme: light)")
  .addEventListener("change", setFaviconBasedOnSystemTheme);

// Apply system theme or saved theme on load
document.addEventListener("DOMContentLoaded", () => {
  const isLightMode =
    localStorage.getItem("theme") === "light" ||
    (!localStorage.getItem("theme") &&
      window.matchMedia("(prefers-color-scheme: light)").matches);

  document.body.classList.toggle("light-mode", isLightMode);
  themeIcon.className = isLightMode ? "fas fa-sun" : "fas fa-moon";
});

// Toggle theme and update icon
toggleButton.addEventListener("click", () => {
  const isLightMode = document.body.classList.toggle("light-mode");
  localStorage.setItem("theme", isLightMode ? "light" : "dark");
  themeIcon.className = isLightMode ? "fas fa-sun" : "fas fa-moon";
});

/* =============== SHARE MODE =============== */
// Detect if the device supports Web Share API
if (navigator.share) {
  document.getElementById("shareBtn").addEventListener("click", function () {
    navigator
      .share({
        title: PROFILE.name,
        url: PROFILE.url,
      })
      .catch((err) => {
        console.error("Error sharing: ", err);
      });
  });
} else {
  document.getElementById("shareBtn").addEventListener("click", function () {
    new bootstrap.Modal(document.getElementById("shareModal")).show();
  });
}

function shareOn(platform) {
  // Reutiliza las plantillas de URL de js/data.js (SHARE_OPTIONS)
  const option = SHARE_OPTIONS.find(
    (o) => o.name.toLowerCase() === platform.toLowerCase()
  );
  if (!option) return;
  window.open(option.getUrl(PROFILE.url), "_blank");
}

// Initialize Clipboard.js
var clipboard = new ClipboardJS("#copyBtn");
clipboard.on("success", function (e) {
  var copyBtn = document.getElementById("copyBtn");
  copyBtn.classList.add("success");
  copyBtn.innerHTML = '<i class="fas fa-check me-2"></i> Copied!';

  setTimeout(function () {
    copyBtn.classList.remove("success");
    copyBtn.innerHTML = '<i class="fas fa-copy me-2"></i> Copy';
  }, 2000); // Reset the button after 2 seconds
});
clipboard.on("error", function (e) {
  alert("Failed to copy URL.");
});
