document.querySelectorAll(".question").forEach((question) => {
  question.addEventListener("click", () => {
    const parent = question.parentElement;
    parent.classList.toggle("active");
  });
});
