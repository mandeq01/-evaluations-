// ================= DATA STORAGE =================
let evaluations = [];
let currentEvaluation = {
  hospital: "",
  cleanliness: 0,
  staff: 0,
  waitingTime: 0,
  equipment: 0,
  overall: 0,
  reviewer: ""
};


// ================= VALIDATIONS =================
function isValidName(name) { return /^[A-Za-z\s]+$/.test(name); }
function isStrongPassword(pass) { return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pass); }
function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

// ================= FEEDBACK =================
function showFeedback(element, message, color) {
  if (!element) return;
  element.textContent = message;
  element.style.color = color;
}

// ================= SIGNUP =================
function registerUser() {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("confirmPassword").value;
  const feedback = document.getElementById("signupFeedback");

  if (!name || !email || !password || !confirm) { showFeedback(feedback,"All fields required","red"); return; }
  if (!isValidName(name)) { showFeedback(feedback,"Name must be letters only","red"); return; }
  if (!isValidEmail(email)) { showFeedback(feedback,"Enter valid email","red"); return; }
  if (!isStrongPassword(password)) { showFeedback(feedback,"Password not strong enough","red"); return; }
  if (password !== confirm) { showFeedback(feedback,"Passwords do not match","red"); return; }

  localStorage.setItem("registeredUser", JSON.stringify({name,email,password}));
  showFeedback(feedback,"Signup successful! Redirecting...","green");
  setTimeout(function(){ window.location.href="login.html"; }, 1500);
}


// ================= LOGIN =================\
function loginUser() {
  const name = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const feedback = document.getElementById("loginFeedback");

  const savedUser = JSON.parse(localStorage.getItem("registeredUser")||"null");
  if (!savedUser) { showFeedback(feedback,"No account found. Signup first.","red"); return; }
  if (!name || !password) { showFeedback(feedback,"All fields required","red"); return; }
  if (name!==savedUser.name || password!==savedUser.password) { showFeedback(feedback,"Invalid credentials","red"); return; }

  localStorage.setItem("isLoggedIn","true");
  localStorage.setItem("userName",name);
  showFeedback(feedback,"Login successful","green");
}

// ================= EVALUATION PAGE PROTECTION =================
function protectEvaluationPage() {
  const loggedIn = localStorage.getItem("isLoggedIn");
  const feedback = document.getElementById("loginWarning");
  const form = document.querySelector(".evaluation-form");
  if (!form) return;
  if (!loggedIn) { if(feedback){ showFeedback(feedback,"Login required to evaluate","red"); } form.classList.add("locked"); }
  else { if(feedback){ showFeedback(feedback,"Welcome "+localStorage.getItem("userName"),"green"); } }
}

// ================= STAR RATINGS =================
function setupStarRatings() {
  const starGroups = document.querySelectorAll(".stars");
  starGroups.forEach(function(group){
    const category = group.dataset.category;
    group.querySelectorAll("span").forEach(function(star,index){
      star.addEventListener("click",function(){ 
        group.querySelectorAll("span").forEach(function(s,i){ s.classList.toggle("active",i<=index); });
        currentEvaluation[category]=index+1; 
      });
    });
  });
}

// ================= SUBMIT EVALUATION =================
function submitEvaluation() {
  const hospital = document.getElementById("hospital").value;
  const feedback = document.getElementById("evaluationMessage");
  currentEvaluation.hospital = hospital;
  currentEvaluation.reviewer = localStorage.getItem("userName");

  if (!hospital || currentEvaluation.cleanliness===0 || currentEvaluation.staff===0 || currentEvaluation.waitingTime===0 || currentEvaluation.equipment===0 || currentEvaluation.overall===0) {
    showFeedback(feedback,"Complete all ratings","red"); return;
  }

  currentEvaluation.average=((currentEvaluation.cleanliness+currentEvaluation.staff+currentEvaluation.waitingTime+currentEvaluation.equipment+currentEvaluation.overall)/5).toFixed(1);
  evaluations.push({...currentEvaluation});
  renderEvaluations(); generateAnalytics();
  showFeedback(feedback,"Evaluation submitted!","green");

  currentEvaluation={hospital:"",cleanliness:0,staff:0,waitingTime:0,equipment:0,overall:0,reviewer:""};
  document.getElementById("hospital").value="";
  document.querySelectorAll(".stars span").forEach(function(star){ star.classList.remove("active"); });
}

// ================= RENDER EVALUATIONS =================
function renderEvaluations() {
  const container=document.getElementById("reviewContainer"); if(!container) return;
  container.innerHTML="";
  evaluations.forEach(function(e){
    const card=document.createElement("div"); card.className="review-card";
    card.innerHTML="<strong>"+e.hospital+"</strong><br>Reviewer: "+e.reviewer+
    "<br>Cleanliness: "+e.cleanliness+" ★<br>Staff: "+e.staff+" ★<br>Waiting: "+e.waitingTime+
    " ★<br>Equipment: "+e.equipment+" ★<br>Overall: "+e.overall+" ★<br><strong>Average: "+e.average+" ★</strong>";
    container.appendChild(card);
  });
}

// ================= ANALYTICS =================
function generateAnalytics() {
  const analyticsBox=document.getElementById("analyticsBox"); if(!analyticsBox) return;
  let summary={};
  evaluations.forEach(function(e){ if(!summary[e.hospital]) summary[e.hospital]=[]; summary[e.hospital].push(parseFloat(e.average)); });
  analyticsBox.innerHTML="";
  for(let hospital in summary){
    const avg=summary[hospital].reduce(function(a,b){return a+b;},0)/summary[hospital].length;
    const div=document.createElement("div"); div.className="analytics-box";
    div.innerHTML="<h3>"+hospital+"</h3><p>Average: "+avg.toFixed(1)+" ★</p><p>Total Reviews: "+summary[hospital].length+"</p>";
    analyticsBox.appendChild(div);
  }
}

// ================= CONTACT FORM =================
function sendMessage() {
  const name=document.getElementById("contactName").value.trim();
  const email=document.getElementById("contactEmail").value.trim();
  const message=document.getElementById("contactMessage").value.trim();
  const feedback=document.getElementById("contactFeedback");
  if(!name || !email || !message){ showFeedback(feedback,"All fields required","red"); return; }
  if(!isValidName(name)){ showFeedback(feedback,"Name must be letters only","red"); return; }
  if(!isValidEmail(email)){ showFeedback(feedback,"Enter valid email","red"); return; }
  showFeedback(feedback,"Message sent successfully!","green");
  document.getElementById("contactName").value=""; document.getElementById("contactEmail").value=""; document.getElementById("contactMessage").value="";
}

// ================= INIT =================
window.addEventListener("load",function(){
  protectEvaluationPage(); setupStarRatings(); generateAnalytics();
});
