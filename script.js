document.addEventListener("DOMContentLoaded", function () {

    let loggedIn = localStorage.getItem("loggedInUser");

    let warning = document.getElementById("login-warning");
    let hospital = document.getElementById("hospital");
    let submitBtn = document.getElementById("submitBtn");
    let resetBtn = document.getElementById("resetBtn");
    let ratings = {};
    let ratingBoxes = document.querySelectorAll(".rating");

    // ---------- LOGIN CONTROL ----------
    if (!loggedIn) {
        warning.textContent = "⚠ You must login before evaluating hospitals!";
        hospital.disabled = true;
        submitBtn.disabled = true;
        resetBtn.disabled = true;

        ratingBoxes.forEach(function (box) {
            box.style.pointerEvents = "none";
            box.style.opacity = "0.4";
        });

    } else {
        warning.textContent = "";
        hospital.disabled = false;
        submitBtn.disabled = false;
        resetBtn.disabled = false;

        ratingBoxes.forEach(function (box) {
            box.style.pointerEvents = "auto";
            box.style.opacity = "1";
        });
    }

    // ---------- STAR RATING ----------
    ratingBoxes.forEach(function (box) {
        let stars = box.querySelectorAll("span");

        stars.forEach(function (star, index) {
            star.addEventListener("click", function () {

                if (!loggedIn) {
                    alert("Please login before evaluating!");
                    return;
                }

                stars.forEach(function (s, i) {
                    s.className = i <= index ? "selected" : "";
                });

                ratings[box.dataset.aspect] = index + 1;
            });
        });
    });

    // ---------- SUBMIT ----------
    document.getElementById("evaluationForm").addEventListener("submit", function (e) {
        e.preventDefault();

        if (!loggedIn) {
            alert("You must login before evaluating!");
            return;
        }

        let name = document.getElementById("eval-name").value.trim();
        if (!/^[A-Za-z\s]+$/.test(name)) {
            alert("Name must contain letters only!");
            return;
        }

        if (hospital.value === "") {
            alert("Select a hospital!");
            return;
        }

        let requiredAspects = ["doctor", "waiting", "cleanliness", "treatment", "staff", "equipment"];
        for (let a of requiredAspects) {
            if (!ratings[a]) {
                alert("Please rate all categories!");
                return;
            }
        }

        alert("✅ Evaluation submitted successfully!");
        this.reset();
        ratings = {};

        document.querySelectorAll(".selected").forEach(function (s) {
            s.classList.remove("selected");
        });
    });

    // ---------- RESET ----------
    resetBtn.addEventListener("click", function () {
        ratings = {};
        document.querySelectorAll(".selected").forEach(function (s) {
            s.classList.remove("selected");
        });
    });

});