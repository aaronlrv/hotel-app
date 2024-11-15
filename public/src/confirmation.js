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
  const children = urlParams.get("children_num");

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
      // Define the room description based on the room type
      let roomDescription;
      if (room.room_type === "Single") {
        roomDescription =
          "This elegant single room is designed with comfort and style in mind, featuring a cozy single bed perfect for solo travelers. Enjoy breathtaking views right from your window, complemented by premium amenities such as high-speed Wi-Fi, a flat-screen TV, and a well-appointed workspace. With thoughtful details like plush bedding, a modern en-suite bathroom, and complimentary toiletries, this room ensures a serene and memorable stay. Perfect for both business and leisure travelers seeking a refined experience.";
      } else if (room.room_type === "Double") {
        roomDescription =
          "This beautifully designed double room offers the perfect blend of comfort and sophistication, featuring a spacious double bed ideal for couples or solo travelers seeking extra space. Enjoy captivating views from your window, paired with top-notch amenities including high-speed Wi-Fi, a flat-screen TV, and a stylish seating area. The modern en-suite bathroom, complete with luxurious toiletries, ensures a relaxing experience. With premium bedding and thoughtful touches throughout, this room provides a tranquil retreat for both leisure and business travelers.";
      } else if (room.room_type === "Suite") {
        roomDescription =
          "This luxurious suite redefines comfort and elegance, offering a spacious layout perfect for travelers seeking an elevated stay. The suite features a plush king-sized bed, a separate living area with stylish furnishings, and large windows showcasing stunning views. Enjoy premium amenities including high-speed Wi-Fi, a flat-screen TV, a fully stocked minibar, and an in-room coffee machine. The lavish en-suite bathroom is equipped with a soaking tub, a rainfall shower, and deluxe toiletries. Ideal for both relaxation and productivity, this suite promises an unforgettable experience for discerning guests.";
      } else {
        roomDescription =
          "This luxurious room offers stunning views and top amenities to make your stay unforgettable."; // Default description if needed
      }

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
                ${roomDescription}
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
