const daysTag = document.querySelector(".days"),
  currentDate = document.querySelector(".current-date"),
  prevNextIcon = document.querySelectorAll(".icons span");

const secondDaysTag = document.querySelector("#secondDays");
let secondCurrentDate = document.querySelector("#secondDate");
let secondPrevNextIcon = document.querySelectorAll(".secondIcons span");

let lastSelectedDate1 = null; // For Calendar 1
let lastSelectedDate2 = null; // For Calendar 2

// Getting new date, current year and month
let date = new Date(),
  currYear = date.getFullYear(),
  currMonth = date.getMonth();

let date1 = new Date(),
  currYear1 = date1.getFullYear(),
  currMonth1 = date1.getMonth();

let date2 = new Date(),
  currYear2 = date2.getFullYear(),
  currMonth2 = date2.getMonth();

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
    liTag1 += `<li>${i}</li>`;
  }
  for (let i = lastDayofMonth1; i < 6; i++) {
    liTag1 += `<li class="inactive">${i - lastDayofMonth1 + 1}</li>`;
  }

  currentDate.innerText = `${months[currMonth1]} ${currYear1}`;
  daysTag.innerHTML = liTag1;

  // Add event listeners for each day in Calendar 1
  const days1 = daysTag.querySelectorAll('li');
  days1.forEach(day => {
    day.addEventListener('click', () => {
      // Clear previous active state in Calendar 1
      clearActiveClass(daysTag);
      
      // Set active class to the clicked date
      day.classList.add('active');
      
      // Store last selected date
      lastSelectedDate1 = day.innerText;
      console.log(`Last clicked date on Calendar 1: ${lastSelectedDate1} ${months[currMonth1]}`);
    });
  });
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
    liTag2 += `<li>${i}</li>`;
  }
  for (let i = lastDayofMonth2; i < 6; i++) {
    liTag2 += `<li class="inactive">${i - lastDayofMonth2 + 1}</li>`;
  }

  secondCurrentDate.innerText = `${months[currMonth2]} ${currYear2}`;
  secondDaysTag.innerHTML = liTag2;

  // Add event listeners for each day in Calendar 2
  const days2 = secondDaysTag.querySelectorAll('li');
  days2.forEach(day => {
    day.addEventListener('click', () => {
      // Clear previous active state in Calendar 2
      clearActiveClass(secondDaysTag);
      
      // Set active class to the clicked date
      day.classList.add('active');
      
      // Store last selected date
      lastSelectedDate2 = day.innerText;
      console.log(`Last clicked date on Calendar 2: ${lastSelectedDate2} ${months[currMonth2]}`);
    });
  });
};

// Function to clear active class from all days in a calendar
const clearActiveClass = (calendar) => {
  const days = calendar.querySelectorAll('li');
  days.forEach(day => {
    day.classList.remove('active');
  });
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
