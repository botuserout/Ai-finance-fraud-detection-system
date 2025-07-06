document.getElementById("changeAuth").addEventListener("click", function () {
  changeAuthType();
});

let authText = document.getElementById("authText");
let userInput = document.getElementById("userInput");
let changeAuth = document.getElementById("changeAuth");
let emailInput = document.getElementById("email");
let passwordInput = document.getElementById("password");
let authBtn = document.getElementById("authBtn");
let authWith = document.getElementById("authWith");
let errEmail = document.getElementById("errEmail");
let err = document.getElementById("err");
let parent = document.body;

function changeAuthType() {
  if (authText.textContent === "Login") {
    authText.textContent = "Sign UP";
    authBtn.textContent = "Sign Up";
    authWith.textContent = "Sign Up with";

    userInput.style = "display:block;";
  } else {
    authText.textContent = "Login";
    authBtn.textContent = "Login";
    authWith.textContent = "Login with";

    userInput.style = "display:none";
  }
}

document.getElementById("authBtn").addEventListener("click", function (event) {
  event.preventDefault();
  auth();
});

function auth() {

  //   if (emailInput.value.trim() !== "" && password.value.trim() !== "") {
  let isValid = true;
  if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      emailInput.value.trim()
    )
  ) {
    errEmail.textContent = "Email is not valid";
    isValid = false;
  } else {
    errEmail.textContent = "";
  }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(passwordInput.value.trim())) {
      err.textContent = "Password must have 6+ characters, 1 uppercase, 1 lowercase, 1 number.";
      isValid = false;
    } else {
      err.textContent = "";
    }
  if (isValid) {
    localStorage.setItem("email", emailInput.value);
    window.location.href = "createUserAccount.html";
  }

  //   }
  //   if (emailInput.value.trim() === "") {
  //     emailInput.style = "border:2px solid red;";
  //     emailInput.placeholder = "Email is required";
  //   }
  //   if (
  //     passwordInput.value.trim() === "" ||
  //     /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password.value.trim())
  //   ) {
  //     passwordInput.placeholder = "Password is required";
  //     // err.textContent =
  //     //   "Password must have 6+ characters, 1 uppercase, 1 lowercase, 1 number.";
  //     passwordInput.style = "border:2px solid red;";
  //   }
}
