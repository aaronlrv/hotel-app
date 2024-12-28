document.querySelectorAll(".amenity").forEach((item) => {
  item.addEventListener("mouseover", () => {
    item.style.boxShadow = "0 10px 15px rgba(0, 0, 0, 0.2)";
  });

  item.addEventListener("mouseout", () => {
    item.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  });
});
