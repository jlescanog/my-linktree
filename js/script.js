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
        title: "Anuswar R Rao",
        url: "https://anuswarr.netlify.app/",
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
  const shareUrl = "https://anuswarr.netlify.app/";
  let shareURL = "";
  // Set the URL input value for copying
  document.getElementById("shareUrl").value = shareUrl;

  switch (platform) {
    case "facebook":
      shareURL = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
      break;
    case "twitter":
      shareURL = `https://twitter.com/intent/tweet?url=${shareUrl}`;
      break;
    case "linkedin":
      shareURL = `https://www.linkedin.com/shareArticle?url=${shareUrl}`;
      break;
    case "whatsapp":
      shareURL = `https://wa.me/?text=${shareUrl}`;
      break;
    case "email":
      shareURL = `mailto:?subject=Check this out&body=${shareUrl}`;
      break;
    default:
      break;
  }
  window.open(shareURL, "_blank");
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
