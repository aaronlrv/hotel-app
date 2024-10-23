const path = require("path"); // Import path module
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "aaron", // Replace with your MySQL username
  password: "1234", // Replace with your MySQL password
  database: "hotel_db",
});

app.use(express.static(path.join(__dirname, "public")));

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "secretKey",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

// Serve static files (HTML, CSS)
app.use(express.static("public"));

app.get("/isAuthenticated", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, username: req.session.user.username }); // Send user status
  } else {
    res.json({ loggedIn: false }); // Send not-logged-in status
  }
});

// for registering

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query =
    "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";
  db.query(query, [username, email, hashedPassword], (err, result) => {
    if (err) {
      return res.send("Error: User already exists or invalid data.");
    }
    res.send('Registration successful! <a href="/login.html">Login here</a>');
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).send("Server error.");
    }

    if (results.length === 0) {
      return res.status(401).send("Invalid username or password.");
    }

    const user = results[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).send("Invalid username or password.");
    }

    req.session.user = { id: user.id, username: user.username };
    res.redirect("/dashboard"); // Redirect to user home page after succesful login
  });
});

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next(); // User is authenticated, proceed route
  } else {
    res.redirect("/login.html"); // Redirect to login page if not authenticated
  }
}

// Route to check if user is logged in
app.get("/check-login", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true }); // User is logged in
  } else {
    res.json({ loggedIn: false }); // User is not logged in
  }
});

// To make sure that the dashboard is only accessible after user login only
app.get("/booking-page", (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, "public", "booking-page.html")); // take user to  dashboard page if logged in
  } else {
    res.redirect("/login.html"); // Redirect user to login if not authenticated
  }
});

app.get("/dashboard", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html")); // Serve protected HTML page
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login.html"); // Redirect to login page after logout
});

// Route to serve mainpage.html when accessing the root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "mainpage.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
