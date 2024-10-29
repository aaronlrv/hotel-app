const images = document.querySelectorAll(".image");
const coloredBackgrounds = document.querySelectorAll(".colored-background");
const nextButton = document.querySelector(".right");
const prevButton = document.querySelector(".left");
let currentIndex = 0;

function updateBackground() {
  coloredBackgrounds.forEach((bg, index) => {
    bg.classList.remove("active");
    if (index === currentIndex) {
      bg.classList.add("active");
    }
  });
}

function showNextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  updateBackground();
  // Adjust image position
  document.querySelector(".images").style.transform = `translateX(-${
    currentIndex * 100
  }%)`;
}

function showPrevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateBackground();
  // Adjust image position
  document.querySelector(".images").style.transform = `translateX(-${
    currentIndex * 100
  }%)`;
}

nextButton.addEventListener("click", showNextImage);
prevButton.addEventListener("click", showPrevImage);
updateBackground(); // Initial call to set the first background
