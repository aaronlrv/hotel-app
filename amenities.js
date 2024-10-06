const navLeft = document.querySelector(".left");
const navRight = document.querySelector(".right");

const images = document.querySelector(".images");

let index = 0;

function right() {
  // Move to next image, loop back to first if at the end
  index = index < 3 ? index + 1 : 0;
  transform(index);
}

function left() {
  // Move to previous image, loop back to last if at the beginning
  index = index > 0 ? index - 1 : 3;
  transform(index);
}

navLeft.addEventListener("click", left);
navRight.addEventListener("click", right);

function transform(index) {
  // Apply horizontal translate for sliding effect
  images.style.transform = `translateX(-${index * 100}%)`;
}
