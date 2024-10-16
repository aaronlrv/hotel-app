const daysTag = document.querySelector(".days"),
currentDate = document.querySelector(".current-date"),
prevNextIcon = document.querySelectorAll(".icons span");

const secondDaysTag = document.querySelector("#secondDays")
let secondCurrentDate = document.querySelector("#secondDate")
let secondPrevNextIcon = document.querySelectorAll(".secondIcons span")

console.log("second days + " +  secondDaysTag)
console.log("second current date + " + secondCurrentDate)
console.log("first icon + " + prevNextIcon)
console.log("second icon + " + secondPrevNextIcon)

// getting new date, current year and month
let date = new Date(),
  currYear = date.getFullYear(),
  currMonth = date.getMonth();
// storing full name of all months in array
// For Calendar 1
let date1 = new Date(),
  currYear1 = date1.getFullYear(),
  currMonth1 = date1.getMonth();

// For Calendar 2
let date2 = new Date(),
  currYear2 = date2.getFullYear(),
  currMonth2 = date2.getMonth();

// Storing full name of all months in array
const months = [
  "January", "February", "March", "April", "May", "June", "July", 
  "August", "September", "October", "November", "December"
];

// Render calendar for Calendar 1
const renderCalendar1 = () => {
  let firstDayofMonth1 = new Date(currYear1, currMonth1, 1).getDay(),
    lastDateofMonth1 = new Date(currYear1, currMonth1 + 1, 0).getDate(),
    lastDayofMonth1 = new Date(currYear1, currMonth1, lastDateofMonth1).getDay(),
    lastDateofLastMonth1 = new Date(currYear1, currMonth1, 0).getDate();
  
  let liTag1 = "";
  for (let i = firstDayofMonth1; i > 0; i--) {
    liTag1 += `<li class="inactive">${lastDateofLastMonth1 - i + 1}</li>`;
  }
  for (let i = 1; i <= lastDateofMonth1; i++) {
    let isToday1 =
      i === date1.getDate() && currMonth1 === new Date().getMonth() && currYear1 === new Date().getFullYear()
        ? "active"
        : "";
    liTag1 += `<li class="${isToday1}">${i}</li>`;
  }
  for (let i = lastDayofMonth1; i < 6; i++) {
    liTag1 += `<li class="inactive">${i - lastDayofMonth1 + 1}</li>`;
  }
  
  currentDate.innerText = `${months[currMonth1]} ${currYear1}`;
  daysTag.innerHTML = liTag1;
};

// Render calendar for Calendar 2
const renderCalendar2 = () => {
  let firstDayofMonth2 = new Date(currYear2, currMonth2, 1).getDay(),
    lastDateofMonth2 = new Date(currYear2, currMonth2 + 1, 0).getDate(),
    lastDayofMonth2 = new Date(currYear2, currMonth2, lastDateofMonth2).getDay(),
    lastDateofLastMonth2 = new Date(currYear2, currMonth2, 0).getDate();
  
  let liTag2 = "";
  for (let i = firstDayofMonth2; i > 0; i--) {
    liTag2 += `<li class="inactive">${lastDateofLastMonth2 - i + 1}</li>`;
  }
  for (let i = 1; i <= lastDateofMonth2; i++) {
    let isToday2 =
      i === date2.getDate() && currMonth2 === new Date().getMonth() && currYear2 === new Date().getFullYear()
        ? "active"
        : "";
    liTag2 += `<li class="${isToday2}">${i}</li>`;
  }
  for (let i = lastDayofMonth2; i < 6; i++) {
    liTag2 += `<li class="inactive">${i - lastDayofMonth2 + 1}</li>`;
  }
  
  secondCurrentDate.innerText = `${months[currMonth2]} ${currYear2}`;
  secondDaysTag.innerHTML = liTag2;
};

// Event listener for Calendar 1 arrows
prevNextIcon.forEach((icon) => {
  icon.addEventListener("click", () => {
    currMonth1 = icon.id === "prev" ? currMonth1 - 1 : currMonth1 + 1;
    if (currMonth1 < 0 || currMonth1 > 11) {
      date1 = new Date(currYear1, currMonth1);
      currYear1 = date1.getFullYear();
      currMonth1 = date1.getMonth();
    } else {
      date1 = new Date();
    }
    renderCalendar1();
  });
});

// Event listener for Calendar 2 arrows
secondPrevNextIcon.forEach((icon) => {
  icon.addEventListener("click", () => {
    currMonth2 = icon.id === "prev" ? currMonth2 - 1 : currMonth2 + 1;
    if (currMonth2 < 0 || currMonth2 > 11) {
      date2 = new Date(currYear2, currMonth2);
      currYear2 = date2.getFullYear();
      currMonth2 = date2.getMonth();
    } else {
      date2 = new Date();
    }
    renderCalendar2();
  });
});

// Initial rendering of both calendars
renderCalendar1();
renderCalendar2();
