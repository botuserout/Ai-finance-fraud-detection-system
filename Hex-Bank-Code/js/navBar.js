document.addEventListener("DOMContentLoaded", function () {
  const profileIcon = document.getElementById("colorImg");
  const logoutBtn = document.getElementById("logout"); // Logout button
  const lightMode = document.getElementById("light");
  const darkMode = document.getElementById("dark");
  const settingsOverlay = document.getElementById("settings-overlay");
  const closeBtn = document.getElementById("close-btn");
  const menuItems = document.querySelectorAll(".menu-item");
  
  let parsedData = JSON.parse(localStorage.getItem("usreData"));
  let currentSelectedIndex = 0;

  // ✅ **Profile Icon Click - Open Settings**
  if (profileIcon) {
      profileIcon.addEventListener("click", () => {
          settingsOverlay.style.display = "flex";
      });
  }

  // ✅ **Close Settings Overlay**
  if (closeBtn) {
      closeBtn.addEventListener("click", () => {
          settingsOverlay.style.display = "none";
      });
  }

  // ✅ **Menu Items Click Handling**
  menuItems.forEach((item, index) => {
      item.addEventListener("click", () => {
          menuItems.forEach((el) => el.classList.remove("isSelected"));
          item.classList.add("isSelected");
          currentSelectedIndex = index;

          if (currentSelectedIndex === 0) {
              $("#itemsIndex3").hide();
              $("#itemsIndex0").show();

              if (parsedData) {
                  document.getElementById("userEmail").textContent = parsedData.aadhar;
              }
          } else if (currentSelectedIndex === 2) {
              $("#itemsIndex0").hide();
              $("#itemsIndex3").show();
              lightMode.style.backgroundColor = "gray";
              darkMode.style.backgroundColor = "#d2d2d2";
          }
      });
  });

  // ✅ **Light Mode Activation**
  if (lightMode) {
      lightMode.addEventListener("click", () => {
          document.documentElement.classList.add("dark-mode");
          lightMode.style.backgroundColor = "#d2d2d2";
          darkMode.style.backgroundColor = "gray";
      });
  }

  // ✅ **Dark Mode Activation**
  if (darkMode) {
      darkMode.addEventListener("click", () => {
          document.documentElement.classList.remove("dark-mode");
          lightMode.style.backgroundColor = "gray";
          darkMode.style.backgroundColor = "#d2d2d2";
      });
  }

  // ✅ **Logout Functionality**
  
  if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
          localStorage.removeItem("usreData"); // Clear user session
          window.location.href = "loginPage.html"; // Redirect to login page
      });
  } else {
      console.error("Logout button not found!");
  }
});



