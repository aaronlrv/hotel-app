let divs = document.querySelectorAll(".menu-text");

console.log(divs);

divs.forEach((div) => {
  div.addEventListener("mouseover", (e) => {
    console.log(e.target);
    let selectedText = e.target;
    selectedText.style.color = "#c3a19d";
  });
});
