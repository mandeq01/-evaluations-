let rating = 0;
let reviews = [];

// LOGIN CHECK
window.onload = function () {
  let isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    document.getElementById("loginMessage").textContent =
      "You must login to evaluate hospitals.";
    document.getElementById("loginMessage").style.color = "red";

    document.getElementById("submitBtn").disabled = true;
  } else {
    document.getElementById("loginMessage").textContent =
      "You are logged in. You can submit evaluations.";
    document.getElementById("loginMessage").style.color = "green";
  }
};

// STAR RATING
document.querySelectorAll("#stars span").forEach(star => {
  star.addEventListener("click", function () {
    rating = this.dataset.value;
    updateStars(rating);
  });
});

function updateStars(value) {
  let stars = document.querySelectorAll("#stars span");
  stars.forEach((star, index) => {
    star.style.color = index < value ? "gold" : "gray";
  });
}

// SUBMIT EVALUATION
document.getElementById("submitBtn").addEventListener("click", function () {
  let hospital = document.getElementById("hospital").value;
  let feedback = document.getElementById("feedback").value;
  let message = document.getElementById("formMessage");

  if (hospital === "" || rating === 0 || feedback === "") {
    message.textContent = "All fields are required and rating must be selected.";
    message.style.color = "red";
    return;
  }

  let review = {
    hospital: hospital,
    rating: rating,
    feedback: feedback
  };

  reviews.push(review);
  displayReviews();

  message.textContent = "Evaluation submitted successfully!";
  message.style.color = "green";

  document.getElementById("hospital").value = "";
  document.getElementById("feedback").value = "";
  updateStars(0);
  rating = 0;
});

// DISPLAY REVIEWS
function displayReviews() {
  let list = document.getElementById("reviewList");
  list.innerHTML = "";

  reviews.forEach(r => {
    let div = document.createElement("div");
    div.className = "review-card";
    div.innerHTML = `
      <strong>${r.hospital}</strong><br>
      Rating: ${r.rating} ★<br>
      ${r.feedback}
    `;
    list.appendChild(div);
  });
}