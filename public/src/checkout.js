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

function calculateTotalPrice() {
  const nights = Math.ceil(
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
  );
  let totalPrice = roomPrice * nights;

  if (adults > 2) {
    totalPrice += (adults - 2) * 50 * nights;
  }

  if (children > 2) {
    totalPrice += (children - 2) * 10 * nights;
  }

  return totalPrice;
}

let totalPrice = calculateTotalPrice();
document.getElementById("total-price").textContent = `$${totalPrice}`;

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
