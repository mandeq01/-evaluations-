document.addEventListener("DOMContentLoaded", function () {

/* ================= SIGNUP ================= */
let signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("signup-name").value.trim();
    let email = document.getElementById("signup-email").value.trim();
    let pass = document.getElementById("signup-password").value;
    let pass2 = document.getElementById("signup-password2").value;
    let msg = document.getElementById("signup-message");

    if (/\d/.test(name)) {
      msg.textContent = "Name must contain letters only";
      msg.style.color = "red";
      return;
    }

    if (pass.length < 6) {
      msg.textContent = "Password must be at least 6 characters";
      msg.style.color = "red";
      return;
    }

    if (pass !== pass2) {
      msg.textContent = "Passwords do not match";
      msg.style.color = "red";
      return;
    }

    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPass", pass);

    msg.textContent = "Signup successful. Please login.";
    msg.style.color = "green";
    signupForm.reset();
  });
}

/* ================= LOGIN ================= */
let loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let email = document.getElementById("login-email").value.trim();
    let pass = document.getElementById("login-password").value;
    let msg = document.getElementById("login-message");

    if (
      email === localStorage.getItem("userEmail") &&
      pass === localStorage.getItem("userPass")
    ) {
      localStorage.setItem("loggedInUser", email);
      msg.textContent = "Login successful!";
      msg.style.color = "green";
      setTimeout(function () {
        window.location.href = "evaluation.html";
      }, 800);
    } else {
      msg.textContent = "Invalid email or password";
      msg.style.color = "red";
    }
  });
}

/* ================= EVALUATION ACCESS ================= */
let evalForm = document.getElementById("evaluationForm");
let warning = document.getElementById("login-warning");

if (evalForm) {
  let loggedIn = localStorage.getItem("loggedInUser");

  if (!loggedIn) {
    evalForm.remove(); // 🔥 REAL BLOCK
    warning.textContent = "⚠️ Please login to evaluate hospitals";
    warning.style.color = "red";
    warning.style.fontWeight = "bold";
    return;
  }
}

/* ================= STAR RATING ================= */
let ratings = {};
let ratingBlocks = document.querySelectorAll(".rating");

ratingBlocks.forEach(function (block) {
  let stars = block.querySelectorAll("span");

  stars.forEach(function (star, index) {
    star.addEventListener("click", function () {
      stars.forEach(function (s, i) {
        s.classList.toggle("selected", i <= index);
      });
      ratings[block.dataset.aspect] = index + 1;
    });
  });
});

/* ================= SUBMIT EVALUATION ================= */
if (evalForm) {
  evalForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let hospital = document.getElementById("hospital").value;
    if (!hospital) {
      alert("Select a hospital");
      return;
    }

    let aspects = ["doctor", "waiting", "cleanliness", "treatment", "staff"];
    for (let i = 0; i < aspects.length; i++) {
      if (!ratings[aspects[i]]) {
        alert("Please rate " + aspects[i]);
        return;
      }
    }

    let total = Number(localStorage.getItem("totalEvals") || 0) + 1;
    localStorage.setItem("totalEvals", total);
    localStorage.setItem("lastHospital", hospital);

    alert("Evaluation submitted successfully");
    evalForm.reset();
    ratings = {};
  });
}

/* ================= CONTACT ================= */
let contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("contact-name").value.trim();
    let feedback = document.getElementById("contact-feedback");

    if (/\d/.test(name)) {
      feedback.textContent = "Name cannot contain numbers";
      feedback.style.color = "red";
      return;
    }

    feedback.textContent = "Message sent successfully!";
    feedback.style.color = "green";
    contactForm.reset();
  });
}

});
