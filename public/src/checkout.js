document.addEventListener("DOMContentLoaded", () => {
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

  // Define room-specific image paths
  const slideContainer = document.querySelector(".slide-container");
  for (let i = 1; i <= 5; i++) {
    const slideDiv = document.createElement("div");
    slideDiv.className = "mySlides fade";
    slideDiv.id = `slide${i}`;
    slideDiv.innerHTML = `<img src="/img/room_${roomId}/${i}.jpg" class="slider-img-large" alt="Room Image ${i}" />`;
    console.log(`room_${roomId}/${i}.jpg"`);
    slideContainer.appendChild(slideDiv);
  }

  let slideIndex = 1;
  showSlides(slideIndex);

  function plusSlides(n) {
    showSlides((slideIndex += n));
  }

  function showSlides(n) {
    const slides = document.querySelectorAll("#slider .mySlides");

    // Ensure the index loops within the range 1-5
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }

    slides.forEach((slide, index) => {
      slide.style.display = index === slideIndex - 1 ? "block" : "none";
    });
  }

  const prevButton = document
    .querySelector(".prev")
    .addEventListener("click", (e) => {
      console.log(e);
      plusSlides(-1);
    });
  const next = document
    .querySelector(".next")
    .addEventListener("click", (e) => {
      console.log(e);
      plusSlides(1);
    });
});
