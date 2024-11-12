fetchAvailableRooms();

function showSlides(n, roomId) {
  const slides = document.querySelectorAll(`#slider-${roomId} .slide`);
  if (slides.length === 0) return; // No slides for this room

  // Wrap-around logic
  if (n >= slides.length) n = 0;
  if (n < 0) n = slides.length - 1;

  slides.forEach((slide, index) => {
    slide.style.display = index === n ? "block" : "none";
  });
}

function nextSlide(roomId) {
  const slides = document.querySelectorAll(`#slider-${roomId} .slide`);
  let currentIndex = Array.from(slides).findIndex(
    (slide) => slide.style.display === "block"
  );
  showSlides(currentIndex + 1, roomId);
}

function prevSlide(roomId) {
  const slides = document.querySelectorAll(`#slider-${roomId} .slide`);
  let currentIndex = Array.from(slides).findIndex(
    (slide) => slide.style.display === "block"
  );
  showSlides(currentIndex - 1, roomId);
}

async function fetchAvailableRooms() {
  const urlParams = new URLSearchParams(window.location.search);
  const start_date = urlParams.get("start_date");
  const end_date = urlParams.get("end_date");
  const adults = urlParams.get("adults_num");
  console.log("adults" + adults);
  const children = urlParams.get("children_num");
  console.log("children" + children);

  try {
    const response = await fetch("/check-availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ start_date, end_date, adults, children }),
    });
    const rooms = await response.json();

    const container = document.querySelector(".rooms-container");
    container.innerHTML = ""; // Clear existing room content

    rooms.forEach((room) => {
      const roomHtml = `
        <div class="room-card">
          <div class="room-card-content">
            <div class="image-slider" id="slider-${room.room_id}">
              ${[1, 2, 3, 4, 5]
                .map(
                  (num) =>
                    `<div class="slide"><img src="/img/room_${room.room_id}/${num}.jpg" class="slider-img" /></div>`
                )
                .join("")}
              <a class="prev" onclick="prevSlide(${room.room_id})">&#10094;</a>
              <a class="next" onclick="nextSlide(${room.room_id})">&#10095;</a>
            </div>
            <div class="room-details">
              <div class="room-title">Room ${room.room_number} - ${
        room.room_type
      }</div>
              <div class="room-price">$${room.price_per_night} / Night</div>
              <div class="room-info">
                This luxurious ${
                  room.room_type
                } room offers stunning views and top amenities to make your stay unforgettable.
              </div>
              <button class="room-select-button" onclick="selectRoom(
                ${room.room_id}, 
                '${room.room_type}', 
                ${room.price_per_night})">Select Room</button>
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", roomHtml);
      showSlides(0, room.room_id); // Initialize the first slide for each room
    });
  } catch (error) {
    console.error("Error loading available rooms:", error);
  }
}

// Function to select a room and redirect to the checkout page
function selectRoom(roomId, roomType, pricePerNight) {
  // Retrieve start and end dates and number of adults/children from the URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const start_date = urlParams.get("start_date");
  const end_date = urlParams.get("end_date");
  const adultNum = urlParams.get("adults_num");
  const childrenNum = urlParams.get("children_num");

  // Set a fixed checkout time
  const checkoutTime = "10:00 AM";

  // Redirect to the checkout page with all details in the URL parameters
  const checkoutUrl = `/checkout?room_id=${roomId}&room_type=${roomType}&price_per_night=${pricePerNight}&start_date=${start_date}&end_date=${end_date}&adults=${adultNum}&children=${childrenNum}&checkout_time=${checkoutTime}`;

  window.location.href = checkoutUrl;
}

/* Attach event listener to each select button (modify existing logic if needed)
document.querySelectorAll(".room-select-button").forEach((button) => {
  button.addEventListener("click", () => {
    const roomId = button.dataset.roomId;
    const roomType = button.dataset.roomType;
    const pricePerNight = button.dataset.pricePerNight;
    selectRoom(roomId, roomType, pricePerNight);
  });
});
*/