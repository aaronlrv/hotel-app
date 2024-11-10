document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomName = urlParams.get("room");
  const roomPrice = urlParams.get("price");
  const startDate = urlParams.get("start_date");
  const endDate = urlParams.get("end_date");
  const adults = urlParams.get("adults");
  const children = urlParams.get("children");

  // Display booking details
  document.getElementById("room-name").textContent = roomName;
  document.getElementById("room-price").textContent = `$${roomPrice} / Night`;
  document.getElementById("start-date").textContent = startDate;
  document.getElementById("end-date").textContent = endDate;
  document.getElementById("adults-num").textContent = adults;
  document.getElementById("children-num").textContent = children;

  // Define room-specific image paths
  const roomImages = {
    Single: [
      "img/room_1/1.jpg",
      "img/room_1/2.jpg",
      "img/room_1/3.jpg",
      "img/room_1/4.jpg",
      "img/room_1/5.jpg",
    ],
    Double: [
      "img/room_2/1.jpg",
      "img/room_2/2.jpg",
      "img/room_2/3.jpg",
      "img/room_2/4.jpg",
      "img/room_2/5.jpg",
    ],
    Suite: [
      "img/room_3/1.jpg",
      "img/room_3/2.jpg",
      "img/room_3/3.jpg",
      "img/room_3/4.jpg",
      "img/room_3/5.jpg",
    ],
  };

  // Set images in the gallery
  const selectedRoomImages = roomImages[roomName];
  selectedRoomImages.forEach((src, index) => {
    document.getElementById(
      `slide${index + 1}`
    ).innerHTML = `<img src="${src}" alt="Room Image" />`;
  });

  // Initialize and control the gallery slider
  let slideIndex = 1;
  showSlides(slideIndex);

  function showSlides(n) {
    const slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
  }

  function plusSlides(n) {
    showSlides((slideIndex += n));
  }

  document
    .querySelector(".prev")
    .addEventListener("click", () => plusSlides(-1));
  document
    .querySelector(".next")
    .addEventListener("click", () => plusSlides(1));
});
