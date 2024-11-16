const urlParams = new URLSearchParams(window.location.search);
const roomName = urlParams.get("room_type");
const roomPrice = urlParams.get("price_per_night");
const startDate = urlParams.get("start_date");
const endDate = urlParams.get("end_date");
const adults = urlParams.get("adults");
const children = urlParams.get("children");
const roomId = urlParams.get("room_id");

// Display booking details
document.getElementById("room-name").textContent = roomName;
document.getElementById("room-price").textContent = `$${roomPrice} / Night`;
document.getElementById("start-date").textContent = startDate;
document.getElementById("end-date").textContent = endDate;
document.getElementById("adults-num").textContent = adults;
document.getElementById("children-num").textContent = children;

// Room descriptions
const roomDescriptions = {
  Single:
    "This elegant single room is designed with comfort and style in mind, featuring a cozy single bed perfect for solo travelers. Enjoy breathtaking views right from your window, complemented by premium amenities such as high-speed Wi-Fi, a flat-screen TV, and a well-appointed workspace. With thoughtful details like plush bedding, a modern en-suite bathroom, and complimentary toiletries, this room ensures a serene and memorable stay. Perfect for both business and leisure travelers seeking a refined experience.",
  Double:
    "This beautifully designed double room offers the perfect blend of comfort and sophistication, featuring a spacious double bed ideal for couples or solo travelers seeking extra space. Enjoy captivating views from your window, paired with top-notch amenities including high-speed Wi-Fi, a flat-screen TV, and a stylish seating area. The modern en-suite bathroom, complete with luxurious toiletries, ensures a relaxing experience. With premium bedding and thoughtful touches throughout, this room provides a tranquil retreat for both leisure and business travelers.",
  Suite:
    "This luxurious suite redefines comfort and elegance, offering a spacious layout perfect for travelers seeking an elevated stay. The suite features a plush king-sized bed, a separate living area with stylish furnishings, and large windows showcasing stunning views. Enjoy premium amenities including high-speed Wi-Fi, a flat-screen TV, a fully stocked minibar, and an in-room coffee machine. The lavish en-suite bathroom is equipped with a soaking tub, a rainfall shower, and deluxe toiletries. Ideal for both relaxation and productivity, this suite promises an unforgettable experience for discerning guests.",
};

// Number of beds based on room type
const beds = {
  Single: 1,
  Double: 2,
  Suite: 3,
};

function calculateTotalPrice() {
  const nights = Math.ceil(
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
  );
  let totalPrice = roomPrice * nights;
  let extraChargesNote = ""; // Initialize here

  if (adults > 2) {
    const extraAdults = adults - 2;
    totalPrice += extraAdults * 50 * nights;
    extraChargesNote += `Additional charge for ${extraAdults} extra adult(s) at $50 per night each.\n`;
  }

  if (children > 2) {
    const extraChildren = children - 2;
    totalPrice += extraChildren * 10 * nights;
    extraChargesNote += `Additional charge for ${extraChildren} extra child(ren) at $10 per night each.\n`;
  }

  return { totalPrice, extraChargesNote };
}

// Set the calculated total price and additional charge note
const { totalPrice, extraChargesNote } = calculateTotalPrice();
document.getElementById("total-price").textContent = `$${totalPrice}`;
document.getElementById("extra-charges-note").textContent =
  extraChargesNote || "No additional charges.";

// Display room-specific information
document.getElementById("room-name").textContent = roomName;
document.getElementById("room-description").textContent =
  roomDescriptions[roomName];
document.getElementById("beds-count").textContent = `Beds: ${beds[roomName]}`;

document
  .getElementById("confirm-booking")
  .addEventListener("click", async () => {
    try {
      const response = await fetch("/confirm-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: roomId,
          room_name: roomName,
          start_date: startDate,
          end_date: endDate,
          total_price: totalPrice,
          price_per_night: roomPrice,
          adults_count: adults,
          kids_count: children,
        }),
      });

      if (response.ok) {
        alert("Booking confirmed successfully!");
        window.location.href = "/thank-you"; // Redirect to a confirmation page if needed
      } else {
        throw new Error("Failed to confirm booking");
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Error confirming booking, please try again.");
    }
  });

const slideContainer = document.querySelector(".slide-container");
slideContainer.innerHTML = ""; // Clear any existing slides

// Add navigation arrows to the slide container
const prevButton = document.createElement("a");
prevButton.className = "prev";
prevButton.innerHTML = "&#10094;";
prevButton.onclick = () => plusSlides(-1);
slideContainer.appendChild(prevButton);

const nextButton = document.createElement("a");
nextButton.className = "next";
nextButton.innerHTML = "&#10095;";
nextButton.onclick = () => plusSlides(1);
slideContainer.appendChild(nextButton);

// Add images for the specific room based on roomId
for (let i = 1; i <= 5; i++) {
  const slideDiv = document.createElement("div");
  slideDiv.className = "mySlides fade";
  slideDiv.style.display = i === 1 ? "block" : "none"; // Show only the first image initially
  slideDiv.innerHTML = `<img src="/img/room_${roomId}/${i}.jpg" class="slider-img-large" alt="Room Image ${i}" />`;
  slideContainer.appendChild(slideDiv);
}

let slideIndex = 1;

function showSlides(n) {
  const slides = document.querySelectorAll(".mySlides");

  if (n > slides.length) slideIndex = 1;
  if (n < 1) slideIndex = slides.length;

  slides.forEach((slide, index) => {
    slide.style.display = index === slideIndex - 1 ? "block" : "none";
  });
}

// Controls for next/previous slides
window.plusSlides = function (n) {
  showSlides((slideIndex += n));
};

// Initialize the first slide
showSlides(slideIndex);
