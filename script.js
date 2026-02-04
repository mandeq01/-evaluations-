document.addEventListener("DOMContentLoaded", function () {

/* ========= LOGIN CHECK ========= */
let evalForm = document.getElementById("evaluationForm");
let warning = document.getElementById("login-warning");

if (evalForm) {
  let loggedIn = localStorage.getItem("loggedInUser");

  if (!loggedIn) {
    // hide evaluation completely
    evalForm.style.display = "none";

    // show message
    warning.style.display = "block";
    warning.style.color = "red";
    warning.style.fontWeight = "bold";
    warning.style.textAlign = "center";

    return; // STOP ALL evaluation JS
  }
}

/* ========= STAR RATINGS ========= */
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

/* ========= SUBMIT EVALUATION ========= */
if (evalForm) {
  evalForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let hospital = document.getElementById("hospital").value;
    if (!hospital) {
      alert("Please select a hospital");
      return;
    }

    let aspects = ["doctor","waiting","cleanliness","treatment","staff"];
    for (let i = 0; i < aspects.length; i++) {
      if (!ratings[aspects[i]]) {
        alert("Please rate " + aspects[i]);
        return;
      }
    }

    let total = Number(localStorage.getItem("totalEvals") || 0) + 1;
    localStorage.setItem("totalEvals", total);
    localStorage.setItem("lastHospital", hospital);

    alert("Evaluation submitted successfully!");
    evalForm.reset();
    ratings = {};
  });
}

});