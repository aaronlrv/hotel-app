async function menubar() {
  try {
    const response = await fetch("/check-login");
    const data = await response.json();
    const menuOptions = document.getElementById("menu-options");

    // Create the login/logout link element
    const authLink = document.createElement("a");
    authLink.className = "menu-text";

    if (data.loggedIn) {
      // Show "Logout" if the user is logged in
      authLink.href = "/logout";
      authLink.textContent = "Logout";
    } else {
      // Show "Login" if the user is not logged in
      authLink.href = "/login";
      authLink.textContent = "Login";
    }

    menuOptions.appendChild(authLink); // Add the login/logout link to the menu

    // Optional: Add "Dashboard" link if logged in
    if (data.loggedIn) {
      const dashboardLink = document.createElement("a");
      dashboardLink.className = "menu-text";
      dashboardLink.href = "/dashboard";
      dashboardLink.textContent = "Dashboard";
      menuOptions.appendChild(dashboardLink);
    }
  } catch (error) {
    console.error("Error checking login status:", error);
  }

  // Mouseover color change logic for menu items
  let menuLinkText = document.querySelectorAll(".menu-text");

  menuLinkText.forEach((text) => {
    text.addEventListener("mouseover", (e) => {
      let selectedText = e.target;
      selectedText.style.color = "#c3a19d";
    });

    text.addEventListener("mouseout", (e) => {
      let selectedText = e.target;
      selectedText.style.color = "black";
    });
  });
}

menubar();
