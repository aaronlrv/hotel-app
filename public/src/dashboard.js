let bookings = [];
let currentPage = 1;
const itemsPerPage = 3;

document.addEventListener("DOMContentLoaded", async () => {
  const username = await fetchUsername();
  document.querySelector(
    "#welcome-message"
  ).textContent = `Welcome, ${username}!`;

  // Fetch and display bookings
  await fetchUserBookings();
  displayBookings(currentPage);
  setupPaginationControls();
});

// Function to get username
async function fetchUsername() {
  const response = await fetch("/check-login");
  const data = await response.json();
  return data.loggedIn ? data.username : "Guest";
}

async function fetchUserBookings() {
  try {
    const response = await fetch("/user-bookings");
    if (!response.ok) throw new Error("Failed to fetch bookings");

    bookings = await response.json();
  } catch (error) {
    console.error("Error fetching bookings:", error);
  }
}

// Display bookings for the current page
function displayBookings(page) {
  const bookingsContainer = document.querySelector("#bookings-list");
  bookingsContainer.innerHTML = ""; // Clear previous content

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBookings = bookings.slice(startIndex, endIndex);

  paginatedBookings.forEach((booking) => {
    const bookingElement = document.createElement("div");
    bookingElement.className = "booking-item";

    const formatDate = (date) => {
      const dateObj = new Date(date);
      return dateObj.toISOString().split("T")[0];
    };

    const checkInDate = `${formatDate(booking.start_date)} at 10:00 AM`;
    const checkOutDate = `${formatDate(booking.end_date)} at 10:00 AM`;

    bookingElement.innerHTML = `
        <h3>Room Name: ${booking.room_name}</h3>
        <p><strong>Check-in Date:</strong> ${checkInDate}</p>
        <p><strong>Check-out Date:</strong> ${checkOutDate}</p>
        <p><strong>Price per Night:</strong> $${booking.price_per_night}</p>
        <p><strong>Total Price:</strong> $${booking.total_price}</p>
        <p><strong>Adults:</strong> ${booking.adults_count}</p>
        <p><strong>Children:</strong> ${booking.kids_count}</p>
      `;
    bookingsContainer.appendChild(bookingElement);
  });
}

// Set up pagination controls
function setupPaginationControls() {
  const paginationContainer = document.querySelector("#pagination-controls");
  paginationContainer.innerHTML = ""; // Clear previous controls

  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.classList.add("page-btn");
    pageButton.addEventListener("click", () => {
      currentPage = i;
      displayBookings(currentPage);
    });
    paginationContainer.appendChild(pageButton);
  }
}
