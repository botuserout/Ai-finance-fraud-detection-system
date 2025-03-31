//   document.body.style.fontFamily = "CourierPrime"; for my custom font add

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const stateDropdown = document.getElementById("states");
const selectedStateText = document.getElementById("selectedState");

states.forEach((state) => {
  let option = document.createElement("option");
  option.value = state;
  option.textContent = state;
  stateDropdown.appendChild(option);
});

stateDropdown.addEventListener("change", function () {
  $("#selectedState").text(this.value);
  // selectedStateText.textContent = this.value;
});

// account validation code

$(document).ready(function () {
  

  if (localStorage.getItem("email")) {
    $("#uEmail").val(localStorage.getItem("email"));
    $("#uEmail").prop("readonly", true);
  } else {
    $("uEmail").prop("placeholder", "Enter not Email");
  }

  $("#createAccount").click(function () {
    let isValid = true;
    

    // Password Validation
    let password = $("#password").val();
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)) {
      $("#passwordError").text(
        "Password must have 6+ characters, 1 uppercase, 1 lowercase, 1 number."
      );
      isValid = false;
    } else {
      $("#passwordError").text("");
    }

    // Gender Validation
    let gender = $("input[name='gender']:checked").val();
    if (!gender) {
      $("#genderError").text("Please select a gender.");
      isValid = false;
    } else {
      $("#genderError").text("");
    }

    // Bank Account Holder Validation
    let accountHolder = $("#accountHolder").val().trim();
    if (!/^[a-zA-Z]{3,}$/.test(accountHolder)) {
      $("#accountHolderError").text(
        "Holder name is must be 3 or more characters"
      );
      isValid = false;
    } else {
      $("#accountHolderError").text("");
    }

    // Bank Account Number Validation
    let bankAccount = $("#bankAccount").val().trim();
    if (!/^\d{10,16}$/.test(bankAccount)) {
      $("#accountNumError").text("Bank account must be 10-16 digits.");
      isValid = false;
    } else {
      $("#accountNumError").text("");
    }

    // IFSC Code Validation
    let ifsc = $("#ifsc").val().trim();
    if (!/^[A-Z0-9]{6,11}$/.test(ifsc)) {
      $("#ifscError").text("Invalid IFSC Code (6-11 alphanumeric characters).");
      isValid = false;
    } else {
      $("#ifscError").text("");
    }

    // Zip Code Validation
    let zip = $("#zip").val().trim();
    if (!/^\d{5,6}$/.test(zip)) {
      $("#zipError").text("ZIP code must be 5-6 digits.");
      isValid = false;
    } else {
      $("#zipError").text("");
    }

    // phone number Validation
    let phone = $("#phone").val().trim();
    if (!/^\d{10}$/.test(phone)) {
      $("#phoneError").text("phone number must be 10 digits.");
      isValid = false;
    } else if (!/^[7-9]{1}[0-9]{9}$/.test(phone)) {
      $("#phoneError").text("Invalid Phone number start with 7-9");
      isValid = false;
    } else {
      $("#phoneError").text("");
    }

    // DOB Validation (User must be 18+)
    let dob = $("#dob").val();
    let dobDate = new Date(dob);
    let today = new Date();
    let ageFromDOB = today.getFullYear() - dobDate.getFullYear();
    if (ageFromDOB < 18) {
      $("#dobError").text("You must be 18 or older.");
      isValid = false;
    } else {
      $("#dobError").text("");
    }

    // State Validation
    let state = $("#states").val();
    if (state === "") {
      $("#stateError").text("Please select a state.");
      isValid = false;
    } else {
      $("#stateError").text("");
    }

    // add Validation
    let add1 = $("#add1").val().trim();
    let add2 = $("#add2").val().trim();
    if (add1 === "" && add2 === "") {
      $("#addError").text("Enter Address in both lines");
      isValid = false;
    } else {
      $("#addError").text("");
    }

    //aadhar validation
    let aadhar = $("#aadhar").val().trim();
    if (!/^\d{12}$/.test(aadhar)) {
      $("#aadharError").text("Aadhar number must be 12 digits");
      isValid = false;
    } else {
      $("#aadharError").text("");
    }

    //ckycr number validation
    let ckycr = $("#ckycrNum").val().trim();
    if (!/^\d{14}$/.test(ckycr)) {
      $("#ckycrNumError").text("CKYCR number must be 14 digits");
      isValid = false;
    } else {
      $("#ckycrNumError").text("");
    }

    //pan number validation
    let pan = $("#pan").val().trim();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      $("#panError").text("Invalid PAN format (e.g.,ABCDE1234F)");
      isValid = false;
    } else {
      $("#panError").text("");
    }

    if (isValid) {
      let result = confirm("Are you sure you want to submit data");
      if (result) {
        let userData = {
          password,
          dob,
          gender,
          bankAccount,
          accountHolder,
          ifsc,
          zip,
          state,
          aadhar,
          pan,
          phone,
          add1,
          add2,
          ckycr,
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        console.log("Data submitted successfully");
        window.location.href = "../html/index.html";
      }
    } else {
      let alt = confirm("First complete your account form");
      if (!alt) {
        window.location.href = "../html/index.html";
      }
    }
  });
});

