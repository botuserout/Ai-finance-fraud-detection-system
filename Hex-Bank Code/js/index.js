document.addEventListener("DOMContentLoaded", function () {
//   document.body.style.fontFamily = "CourierPrime"; for my custom font add
  document.getElementById("navbarCode").innerHTML = `
  <nav class="default-layout navbar">
      <div class="logoName">
            <img class="logoimg" src="../images/logo.svg" alt="logo" />
            <h4>AI Guard</h4>
            <h4 class="appColor">Bank</h4>
      </div>
      <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#featureSection">Feature</a></li>
            <li><a href="">Solution</a></li>
            <li>
                  <div class="profile">
                        <img id="colorImg" src="../images/profileIcon.svg" alt="">
                  </div>
            </li>
      </ul>
</nav>

<div id="settings-overlay" class="overlay">
      <div class="settings">
            <div class="title-part">
                  <h2>Settings</h2>
                  <div id="item1" class="item-layout menu-item">
                        <img src="../images/account_setting.svg" alt="person1" />
                        <p>Profile Settings</p>

                  </div>
                  <div id="item2" class="item-layout menu-item">
                        <img src="../images/bank_details.svg" alt="person1" />
                        <p>Bank Details</p>
                  </div>
                  <div id="item3" class="item-layout menu-item">
                        <img src="../images/themes_change.svg" alt="person1" />
                        <p>Customize</p>
                  </div>
                  <div id="item4" class="item-layout menu-item">
                        <img src="../images/logout.svg" alt="person1" />
                        <p>Logout</p>
                  </div>
            </div>
            <div id="itemsIndex0" class="detail-part">
                  <div class="profileDetail">
                        <h1></h1>
                        <div class="profiledata">
                              <h2 id="userEmail"></h2>
                              <h2 id="userPassword"></h2>
                        </div>
                  </div>
            </div>
            <div id="itemsIndex3" class="detail-part">
                  <div class="themesDetail">
                        <h3>Change Theme</h3>
                        <div class="themesdata">
                              <div id="light" class="lightMode">
                                    <img src="../images/light_mode.svg" alt="">
                                    <!-- <p>Light Mode</p> -->
                              </div>
                              <div id="dark" class="darkMode isCheck">
                                    <img  src="../images/dark_mode.svg" alt="">
                                    <!-- <p>Dark Mode</p> -->
                              </div>
                        </div>
                  </div>
            </div> 
            
      </div>
      <img id="close-btn" src="../images/close_icon.svg" alt="close" />
</div>`;
});
const startButtons = document.querySelectorAll('.getStartBtn-1, .getStartBtn');
const oldStartButtons = document.querySelectorAll('.getStartBtn-old');

// Redirecting normal "Get Start" buttons to web.html
startButtons.forEach(button => {
    button.addEventListener('click', function() {
        window.location.href = 'web.html';
    });
});

// Redirecting "Past Record🎲" buttons to webold.html
oldStartButtons.forEach(button => {
    button.addEventListener('click', function() {
        window.location.href = 'webold.html';
    });
});
