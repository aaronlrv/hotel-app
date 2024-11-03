async function fetchAvailableRooms() {
  const urlParams = new URLSearchParams(window.location.search);
  const start_date = urlParams.get("start_date");
  const end_date = urlParams.get("end_date");

  if (!start_date || !end_date) {
    document.getElementById("rooms-container").innerText =
      "Invalid dates selected.";
    return;
  }

  const response = await fetch("/check-availability", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ start_date, end_date }),
  });

  const rooms = await response.json();
  const roomsContainer = document.getElementById("rooms-container");
  roomsContainer.innerHTML = "";

  if (rooms.length === 0) {
    roomsContainer.innerText = "No rooms available for the selected dates.";
  } else {
    rooms.forEach((room) => {
      const roomInfo = document.createElement("div");
      roomInfo.innerHTML = `
          <h3>Room ${room.room_number}</h3>
          <p>Type: ${room.room_type}</p>
          <p>Price per Night: $${room.price_per_night}</p>
          <button onclick="bookRoom(${room.room_id})">Select Room</button>
        `;
      roomsContainer.appendChild(roomInfo);
    });
  }
}

function bookRoom(roomId) {
  // Implement booking logic here, possibly redirect to a confirmation page
  alert(`Room ${roomId} selected! Proceed with booking.`);
}

fetchAvailableRooms();
