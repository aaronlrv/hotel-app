document.querySelector(".auth-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent the default form submission

  const username = e.target.username.value;
  const password = e.target.password.value;

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      // If login is successful, redirect to the booking page
      window.location.href = "/booking-page";
    } else {
      // If login fails, display an error message dynamically
      const errorMessage = document.querySelector(".error-message");
      if (!errorMessage) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.textContent =
          "Invalid username or password. Please try again.";
        document.querySelector(".auth-wrapper").prepend(errorDiv);
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("An unexpected error occurred. Please try again later.");
  }
});
