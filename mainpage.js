let menuLinkText = document.querySelectorAll(".menu-text");

console.log(menuLinkText);

menuLinkText.forEach((text) => {
  text.addEventListener("mouseover", (e) => {
    console.log(e.target);
    let selectedText = e.target;
    selectedText.style.color = "#c3a19d";
  });

  text.addEventListener("mouseout", (e) => {
    let selectedText = e.target;
    selectedText.style.color = "black";
  });
});
