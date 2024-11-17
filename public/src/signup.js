document.querySelector(".auth-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent the default form submission

  const username = e.target.username.value;
  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const response = await fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // If sign-up is successful, redirect to the login page
      window.location.href = "/login";
    } else {
      // Display the error message if sign-up fails
      const errorMessage = document.querySelector(".error-message");
      if (!errorMessage) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.textContent =
          data.message || "Something went wrong. Please try again.";
        document.querySelector(".auth-wrapper").prepend(errorDiv);
      }
    }
  } catch (error) {
    console.error("Sign-up error:", error);
    alert("An unexpected error occurred. Please try again later.");
  }
});
