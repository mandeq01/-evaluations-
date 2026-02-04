document.addEventListener("DOMContentLoaded", function () {

  let evalForm = document.getElementById("evaluationForm");
  let warning = document.getElementById("login-warning");

  let ratings = {};

  /* ===== STAR RATING ===== */
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

  /* ===== SUBMIT EVALUATION ===== */
  evalForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let loggedIn = localStorage.getItem("loggedInUser");

    // ❌ NOT LOGGED IN
    if (!loggedIn) {
      warning.textContent = "⚠️ Please login before evaluating hospitals.";
      warning.style.display = "block";
      warning.style.color = "red";
      warning.style.fontWeight = "bold";
      warning.style.textAlign = "center";
      return;
    }

    // ✅ LOGGED IN
    warning.style.display = "none";

    let hospital = document.getElementById("hospital").value;
    if (hospital === "") {
      alert("Please select a hospital.");
      return;
    }

    let aspects = ["doctor", "waiting", "cleanliness", "treatment", "staff"];
    for (let i = 0; i < aspects.length; i++) {
      if (!ratings[aspects[i]]) {
        alert("Please rate " + aspects[i]);
        return;
      }
    }

    alert("Evaluation submitted successfully!");
    evalForm.reset();
    ratings = {};

    document.querySelectorAll(".rating span").forEach(function (s) {
      s.classList.remove("selected");
    });
  });

});