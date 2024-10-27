document.querySelector(".btn-29").addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default button action

  // Check login status from the backend
  fetch("/check-login")
    .then((response) => response.json())
    .then((data) => {
      if (data.loggedIn) {
        // If the user is logged in, redirect to the booking page
        window.location.href = "/booking-page";
      } else {
        // If the user is not logged in, redirect to the login page
        window.location.href = "/login";
      }
    })
    .catch((error) => {
      console.error("Error checking login status:", error);
    });
});
