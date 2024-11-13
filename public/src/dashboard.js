document.addEventListener("DOMContentLoaded", async () => {
  const username = await fetchUsername();
  document.querySelector(
    "#welcome-message"
  ).textContent = `Welcome, ${username}!`;

  // Fetch and display bookings
  fetchUserBookings();
  document.querySelector(".footer").innerHTML = `    <div class="container">
  <div class="row">
    <div class="footer-col">
      <h4>our hotel</h4>
      <ul>
        <li><a href="/aboutUs">about us</a></li>
        <li><a href="/contactUs">contact us</a></li>
        <li><a href="/amenities">amenities</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>get help</h4>
      <ul>
        <li><a href="/faq">FAQ</a></li>
        <li><a href="/booking-policy">Booking Policy</a></li>
        <li><a href="/location">getting here</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>follow us</h4>
      <div class="social-links">
        <a href="#"><i class="fab fa-facebook-f"></i></a>
        <a href="#"><i class="fab fa-twitter"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
        <a href="#"><i class="fab fa-linkedin-in"></i></a>
      </div>
    </div>
  </div>
</div>`;
});

// Function to get username
async function fetchUsername() {
  const response = await fetch("/check-login");
  const data = await response.json();
  return data.loggedIn ? data.username : "Guest";
}

// Function to fetch and display bookings
async function fetchUserBookings() {
  try {
    const response = await fetch("/user-bookings");
    if (!response.ok) throw new Error("Failed to fetch bookings");

    const bookings = await response.json();
    const bookingsContainer = document.querySelector("#bookings-list");

    bookings.forEach((booking) => {
      const bookingElement = document.createElement("div");
      bookingElement.className = "booking-item";
      bookingElement.innerHTML = `
          <p>Room Name: ${booking.room_name}</p>
          <p>Check-in Date: ${booking.start_date}</p>
          <p>Check-out Date: ${booking.end_date}</p>
          <p>Price per Night: $${booking.price_per_night}</p>
          <p>Total Price: $${booking.total_price}</p>
          <p>Adults: ${booking.adults_count}</p>
          <p>Children: ${booking.kids_count}</p>
        `;
      bookingsContainer.appendChild(bookingElement);
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
  }
}
