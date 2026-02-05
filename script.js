/* ======================================================
   GLOBAL DATA STORAGE
====================================================== */

// Store all evaluations in memory (array of objects)
let evaluations = [];

// Current evaluation being filled
let currentEvaluation = {
  hospital: "",
  cleanliness: 0,
  staff: 0,
  waitingTime: 0,
  equipment: 0,
  overall: 0,
  average: 0,
  reviewer: ""
};

/* ======================================================
   VALIDATION UTILITIES
====================================================== */

// Name must contain letters and spaces only
function isValidName(name) {
  const pattern = /^[A-Za-z\s]+$/;
  return pattern.test(name);
}

// Strong password validation
function isStrongPassword(password) {
  const pattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  return pattern.test(password);
}

/* ======================================================
   LOGIN SYSTEM
====================================================== */

function loginUser() {
  const nameInput = document.getElementById("username");
  const passInput = document.getElementById("password");
  const feedback = document.getElementById("loginFeedback");

  if (!nameInput || !passInput) return;

  const name = nameInput.value.trim();
  const password = passInput.value;

  // Empty check
  if (name === "" || password === "") {
    showMessage(feedback, "All fields are required.", "error");
    return;
  }

  // Name validation
  if (!isValidName(name)) {
    showMessage(
      feedback,
      "Name must contain letters only (no numbers or symbols).",
      "error"
    );
    return;
  }

  // Password validation
  if (!isStrongPassword(password)) {
    showMessage(
      feedback,
      "Password must be strong (8+ chars, upper, lower, number, symbol).",
      "error"
    );
    return;
  }

  // Save login state
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userName", name);

  showMessage(
    feedback,
    "Login successful. Evaluation access granted.",
    "success"
  );
}

/* ======================================================
   PAGE PROTECTION (IMPORTANT)
====================================================== */

function protectEvaluationPage() {
  const loggedIn = localStorage.getItem("isLoggedIn");
  const warning = document.getElementById("loginWarning");
  const form = document.querySelector(".evaluation-form");

  if (!form) return;

  if (!loggedIn) {
    if (warning) {
      warning.textContent = "You must login to evaluate hospitals.";
      warning.style.color = "red";
    }

    // Lock the evaluation form
    form.classList.add("locked");
  } else {
    if (warning) {
      const user = localStorage.getItem("userName");
      warning.textContent = "Welcome " + user + ". You can evaluate hospitals.";
      warning.style.color = "green";
    }
  }
}

/* ======================================================
   STAR RATING SYSTEM (MULTI-CRITERIA)
====================================================== */

function setupStarRatings() {
  const starGroups = document.querySelectorAll(".stars");

  starGroups.forEach(group => {
    const category = group.dataset.category;
    const stars = group.querySelectorAll("span");

    stars.forEach((star, index) => {
      star.addEventListener("click", () => {
        updateStars(group, index + 1);
        currentEvaluation[category] = index + 1;
      });
    });
  });
}

function updateStars(group, value) {
  const stars = group.querySelectorAll("span");
  stars.forEach((star, index) => {
    star.classList.toggle("active", index < value);
  });
}

/* ======================================================
   EVALUATION SUBMISSION
====================================================== */

function submitEvaluation() {
  const hospitalSelect = document.getElementById("hospital");
  const feedbackBox = document.getElementById("evaluationMessage");

  if (!hospitalSelect) return;

  currentEvaluation.hospital = hospitalSelect.value;
  currentEvaluation.reviewer = localStorage.getItem("userName");

  // Validation
  if (
    currentEvaluation.hospital === "" ||
    currentEvaluation.cleanliness === 0 ||
    currentEvaluation.staff === 0 ||
    currentEvaluation.waitingTime === 0 ||
    currentEvaluation.equipment === 0 ||
    currentEvaluation.overall === 0
  ) {
    showMessage(
      feedbackBox,
      "Please complete all rating categories before submitting.",
      "error"
    );
    return;
  }

  // Calculate average
  currentEvaluation.average = calculateAverage(currentEvaluation);

  // Save evaluation
  evaluations.push({ ...currentEvaluation });

  // Display reviews dynamically
  renderEvaluations();

  showMessage(
    feedbackBox,
    "Evaluation submitted successfully.",
    "success"
  );

  resetEvaluationForm();
}

/* ======================================================
   CALCULATIONS
====================================================== */

function calculateAverage(e) {
  const total =
    e.cleanliness +
    e.staff +
    e.waitingTime +
    e.equipment +
    e.overall;

  return (total / 5).toFixed(1);
}

/* ======================================================
   DISPLAY REVIEWS (DOM MANIPULATION)
====================================================== */

function renderEvaluations() {
  const container = document.getElementById("reviewContainer");
  if (!container) return;

  container.innerHTML = "";

  evaluations.forEach(e => {
    const card = document.createElement("div");
    card.className = "review-card";

    card.innerHTML = `
      <strong>${e.hospital}</strong><br>
      Reviewer: ${e.reviewer}<br>
      Cleanliness: ${e.cleanliness} ★<br>
      Staff: ${e.staff} ★<br>
      Waiting Time: ${e.waitingTime} ★<br>
      Equipment: ${e.equipment} ★<br>
      Overall: ${e.overall} ★<br>
      <strong>Average Rating: ${e.average} ★</strong>
    `;

    container.appendChild(card);
  });
}

/* ======================================================
   RESET FORM AFTER SUBMISSION
====================================================== */

function resetEvaluationForm() {
  currentEvaluation = {
    hospital: "",
    cleanliness: 0,
    staff: 0,
    waitingTime: 0,
    equipment: 0,
    overall: 0,
    average: 0,
    reviewer: ""
  };

  const stars = document.querySelectorAll(".stars span");
  stars.forEach(star => star.classList.remove("active"));

  const hospitalSelect = document.getElementById("hospital");
  if (hospitalSelect) hospitalSelect.value = "";
}

/* ======================================================
   ANALYTICS GENERATION
====================================================== */

function generateAnalytics() {
  const analyticsBox = document.getElementById("analyticsBox");
  if (!analyticsBox) return;

  let summary = {};

  evaluations.forEach(e => {
    if (!summary[e.hospital]) {
      summary[e.hospital] = [];
    }
    summary[e.hospital].push(parseFloat(e.average));
  });

  analyticsBox.innerHTML = "";

  for (let hospital in summary) {
    const avg =
      summary[hospital].reduce((a, b) => a + b, 0) /
      summary[hospital].length;

    const div = document.createElement("div");
    div.className = "analytics-box";
    div.innerHTML = `
      <h3>${hospital}</h3>
      <p>Average Rating: ${avg.toFixed(1)} ★</p>
      <p>Total Reviews: ${summary[hospital].length}</p>
    `;

    analyticsBox.appendChild(div);
  }
}

/* ======================================================
   CONTACT FORM
====================================================== */

function sendMessage() {
  const name = document.getElementById("contactName");
  const email = document.getElementById("contactEmail");
  const message = document.getElementById("contactMessage");
  const feedback = document.getElementById("contactFeedback");

  if (!name || !email || !message) return;

  if (
    name.value.trim() === "" ||
    email.value.trim() === "" ||
    message.value.trim() === ""
  ) {
    showMessage(feedback, "All fields are required.", "error");
    return;
  }

  showMessage(
    feedback,
    "Thank you for your message. We will respond shortly.",
    "success"
  );

  name.value = "";
  email.value = "";
  message.value = "";
}

/* ======================================================
   UTILITY: FEEDBACK MESSAGES
====================================================== */

function showMessage(element, text, type) {
  if (!element) return;

  element.textContent = text;
  element.className = "feedback " + type;
}

/* ======================================================
   INITIALIZATION ON PAGE LOAD
====================================================== */

window.addEventListener("load", () => {
  protectEvaluationPage();
  setupStarRatings();
  generateAnalytics();
});
/* ======================================================
   SIGNUP / REGISTRATION SYSTEM
====================================================== */

function registerUser() {
  const nameInput = document.getElementById("signupName");
  const emailInput = document.getElementById("signupEmail");
  const passInput = document.getElementById("signupPassword");
  const confirmInput = document.getElementById("confirmPassword");
  const feedback = document.getElementById("signupFeedback");

  if (!nameInput || !emailInput || !passInput || !confirmInput) return;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passInput.value;
  const confirmPassword = confirmInput.value;

  /* ---------- EMPTY CHECK ---------- */
  if (name === "" || email === "" || password === "" || confirmPassword === "") {
    showMessage(feedback, "All fields are required.", "error");
    return;
  }

  /* ---------- NAME VALIDATION ---------- */
  if (!isValidName(name)) {
    showMessage(
      feedback,
      "Name must contain letters only. Numbers are not allowed.",
      "error"
    );
    return;
  }

  /* ---------- EMAIL VALIDATION ---------- */
  if (!email.includes("@") || !email.includes(".")) {
    showMessage(
      feedback,
      "Please enter a valid email address.",
      "error"
    );
    return;
  }

  /* ---------- PASSWORD STRENGTH ---------- */
  if (!isStrongPassword(password)) {
    showMessage(
      feedback,
      "Password is not strong enough.",
      "error"
    );
    return;
  }

  /* ---------- PASSWORD MATCH ---------- */
  if (password !== confirmPassword) {
    showMessage(
      feedback,
      "Passwords do not match.",
      "error"
    );
    return;
  }

  /* ---------- SAVE USER (SIMULATED) ---------- */
  const user = {
    name: name,
    email: email
  };

  localStorage.setItem("registeredUser", JSON.stringify(user));

  showMessage(
    feedback,
    "Account created successfully. You can now login.",
    "success"
  );

  /* ---------- CLEAR FORM ---------- */
  nameInput.value = "";
  emailInput.value = "";
  passInput.value = "";
  confirmInput.value = "";

  /* ---------- OPTIONAL REDIRECT ---------- */
  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);
}