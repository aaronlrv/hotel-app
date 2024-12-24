const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mysqlPromise = require("mysql2/promise");
require("dotenv").config();

console.log({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const app = express();
const PORT = 3000;

const pool = mysqlPromise.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,
  ssl: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

(async () => {
  try {
    const [results] = await pool.query("SELECT 1");
    console.log("Connection pool test successful:", results);
  } catch (err) {
    console.error("Error with connection pool:", err);
  }
})();
// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use an environment variable
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
  })
);

// Serve static assets (CSS, JS, images) from /public directory
app.use(express.static(path.join(__dirname, "public")));

// Serve images from /img directory
app.use("/img", express.static(path.join(__dirname, "img")));

// Serve JavaScript from /src directory
app.use("/src", express.static(path.join(__dirname, "src")));

// Middleware to ensure the user is authenticated for protected routes
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    console.log(`User ${req.session.user.username} is authenticated`);
    return next();
  } else {
    console.log("User not authenticated, redirecting to login.");
    res.redirect("/login");
  }
}

// Routes to serve HTML files from /views directory
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "mainpage.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup.html"));
});

app.get("/booking-page", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "booking-page.html"));
});

app.get("/aboutUs", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "aboutUs.html"));
});

app.get("/contactUs", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "contactUs.html"));
});

app.get("/amenities", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "amenities.html"));
});

app.get("/faq", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "faq.html"));
});

app.get("/booking-policy", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "booking-policy.html"));
});

app.get("/location", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "location.html"));
});

app.get("/confirmation", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "confirmation.html"));
});

app.get("/checkout", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "checkout.html"));
});

app.get("/thank-you", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "thankYou.html"));
});

app.get("/dashboard", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

app.use("/img", express.static(path.join(__dirname, "public/img")));

// Block direct access to any .html files
app.use((req, res, next) => {
  if (req.path.endsWith(".html")) {
    console.log(`Attempt to directly access ${req.path}`);
    return res.status(403).send("Access Forbidden");
  }
  next();
});

// User registration route
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if username or email already exists
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUser.length > 0) {
      // Return an error message if username or email is already taken
      return res
        .status(400)
        .json({ message: "Username or email is already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const query =
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";
    await pool.query(query, [username, email, hashedPassword]);

    console.log("User registered successfully.");
    res.status(201).json({ message: "Sign-up successful." }); // Send success message
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Display available rooms for the selected dates and occupancy
app.post("/check-availability", isAuthenticated, async (req, res) => {
  const { start_date, end_date, adults, children } = req.body;
  const totalOccupants = parseInt(adults) + parseInt(children); // Total occupancy count

  try {
    // SQL query to get rooms that are available for the date range and meet the occupancy requirements
    const [availableRooms] = await pool.query(
      `
      SELECT r.room_id, r.room_number, r.room_type, r.price_per_night 
      FROM rooms r
      WHERE r.room_id NOT IN (
        SELECT room_id 
        FROM reservations 
        WHERE (? <= end_date AND ? >= start_date)
      )
      AND r.max_occupancy >= ?
      `,
      [start_date, end_date, totalOccupants]
    );

    // Respond with the available rooms directly
    res.json(availableRooms);
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    res.status(500).send("Server error");
  }
});

// Book a room
app.post("/book-room", isAuthenticated, async (req, res) => {
  const { room_id, start_date, end_date } = req.body;
  const userId = req.session.userId;

  // Insert the reservation
  await pool.query(
    "INSERT INTO reservations (user_id, room_id, start_date, end_date) VALUES (?, ?, ?, ?)",
    [userId, room_id, start_date, end_date]
  );

  res.send("Room booked successfully!");
});

// User login route
app.post("/login", async (req, res) => {
  console.log("Login request received with:", req.body);
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ?";
  console.log("Executing query:", query, "with username:", username);

  try {
    const [results] = await pool.query(query, [username]); // Use pool.query for better handling

    console.log("Query results:", results);

    if (results.length === 0) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const user = results[0];
    console.log("User found:", user);

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    console.log("Password match:", passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    req.session.user = { id: user.id, username: user.username };
    req.session.userId = user.id;
    console.log("Login successful for user:", user.username);
    res.status(200).json({ message: "Login successful." });
  } catch (error) {
    console.error("Error during login process:", error);
    res.status(500).json({ message: "Server error." });
  }
});

app.post("/confirm-booking", isAuthenticated, async (req, res) => {
  const {
    room_id,
    room_name,
    start_date,
    end_date,
    total_price,
    price_per_night,
    adults_count,
    kids_count,
  } = req.body;

  const user_id = req.session.user ? req.session.user.id : null;

  if (!user_id) {
    console.log("user id aint workin");
    return res.status(401).send("User is not logged in");
  }

  try {
    const query = `
      INSERT INTO reservations (user_id, room_id, start_date, end_date, reservation_status, total_price, price_per_night, kids_count, adults_count, room_name)
      VALUES (?, ?, ?, ?, 'confirmed', ?, ?, ?, ?, ?)
    `;
    await pool.query(query, [
      user_id,
      room_id,
      start_date,
      end_date,
      total_price,
      price_per_night,
      kids_count,
      adults_count,
      room_name,
    ]);

    res.status(200).send("Booking confirmed successfully");
  } catch (error) {
    console.error("Error inserting reservation:", error);
    res.status(500).send("Failed to confirm booking");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).send("Logout failed");
    }
    res.redirect("/"); // Redirect to home after logout
  });
});

// Route to check if user is logged in (for client-side logic)
app.get("/check-login", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, username: req.session.user.username });
  } else {
    res.json({ loggedIn: false });
  }
});

// Fetch user's bookings
app.get("/user-bookings", isAuthenticated, async (req, res) => {
  const user_id = req.session.user ? req.session.user.id : null;

  if (!user_id) {
    return res.status(401).send("User not logged in");
  }

  try {
    const [bookings] = await pool.query(
      `SELECT start_date, end_date, total_price, price_per_night, kids_count, adults_count, room_name
       FROM reservations
       WHERE user_id = ?`,
      [user_id]
    );

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).send("Server error");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
