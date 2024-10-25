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
  host: "192.168.1.118", // Replace with your MySQL host
  user: "aaron", // Replace with your MySQL username
  password: "1234", // Replace with your MySQL password
  database: "hotel_db", // Replace with your database name
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Handle JSON if needed
app.use(cookieParser());
app.use(
  session({
    secret: "secretKey", // Replace with a strong secret in production
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }, // Session lasts for 1 minute
  })
);

// Serve only static assets (CSS, JS, images) from the public directory
// Serve static files from the /public directory
app.use(express.static(path.join(__dirname, "public")));

// Serve images from the /img directory
app.use("/img", express.static(path.join(__dirname, "img")));

// Optional: Serve JS from /src (if you need)
app.use("/src", express.static(path.join(__dirname, "src")));
// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    console.log(`User ${req.session.user.username} is authenticated`);
    return next(); // Proceed to the next handler if authenticated
  } else {
    console.log("User not authenticated, redirecting to login.");
    res.redirect("/login"); // Redirect to login if not authenticated
  }
}

// Serve HTML files through specific routes only
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "mainpage.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.get("/booking-page", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "booking-page.html"));
});

// Block direct access to any .html files
app.use((req, res, next) => {
  if (req.path.endsWith(".html")) {
    console.log(`Attempt to directly access ${req.path}`);
    return res.status(403).send("Access Forbidden");
  }
  next();
});

// Route to register a new user
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const query =
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";
    db.query(query, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error("MySQL Error:", err.sqlMessage || err);
        return res.status(500).send("Error: Unable to register user.");
      }
      console.log("User registered successfully.");
      res.redirect("/login"); // Redirect to login page after signup
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to handle user login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).send("Server error.");
    }

    if (results.length === 0) {
      console.log("User not found");
      return res.status(401).send("Invalid username or password.");
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    console.log(`Password match: ${passwordMatch}`);

    if (!passwordMatch) {
      return res.status(401).send("Invalid username or password.");
    }

    req.session.user = { id: user.id, username: user.username };
    console.log("Login successful. Redirecting to booking page.");
    res.redirect("/booking-page");
  });
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy(); // Destroy session on logout
  res.redirect("/login"); // Redirect to login page
});

// Route to check if user is logged in (for client-side use)
app.get("/check-login", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, username: req.session.user.username });
  } else {
    res.json({ loggedIn: false });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
