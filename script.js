// Shared data layer - all issues stored in localStorage under "issues"

function getIssues() {
  return JSON.parse(localStorage.getItem("issues")) || [];
}

function saveIssues(issues) {
  localStorage.setItem("issues", JSON.stringify(issues));
}

function resolveIssue(id) {
  const issues = getIssues();
  const issue = issues.find((i) => i.id === id);
  if (issue) {
    issue.status = "closed";
    saveIssues(issues);
  }
}

function formatTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Form handling - only runs on the report page, where #issueForm exists
const issueForm = document.getElementById("issueForm");
if (issueForm) {
  issueForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const categoryInput = document.getElementById("category");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");
    const statusMsg = document.getElementById("statusMsg");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    const category = categoryInput.value;

    [nameInput, emailInput, messageInput].forEach((el) => el.classList.remove("invalid"));
    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
    statusMsg.className = "status-msg";
    statusMsg.textContent = "";

    let isValid = true;

    if (!name) {
      nameError.textContent = "Name is required.";
      nameInput.classList.add("invalid");
      isValid = false;
    }

    if (!email) {
      emailError.textContent = "Email is required.";
      emailInput.classList.add("invalid");
      isValid = false;
    } else if (!isValidEmail(email)) {
      emailError.textContent = "Please enter a valid email address.";
      emailInput.classList.add("invalid");
      isValid = false;
    }

    if (!message) {
      messageError.textContent = "Please describe the issue.";
      messageInput.classList.add("invalid");
      isValid = false;
    }

    if (!isValid) return;

    const issues = getIssues();
    issues.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: name,
      email: email,
      category: category,
      message: message,
      timestamp: new Date().toISOString(),
      status: "open",
    });
    saveIssues(issues);

    statusMsg.textContent = "Issue reported successfully. View it on the Public Issue Log.";
    statusMsg.classList.add("success");

    this.reset();
  });
}

// Highlight current page in nav
document.addEventListener("DOMContentLoaded", function () {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach((link) => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });
});
