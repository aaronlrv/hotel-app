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
  user: "root", // Replace with your MySQL username
  password: "Grap34@Dasz", // Replace with your MySQL password
  database: "hotels_db",
});

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
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

// Serve static files (HTML, CSS)
app.use(express.static("public"));

// Routes
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
    if (err || results.length === 0) {
      return res.send("User not found.");
    }
    const user = results[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (isPasswordValid) {
      req.session.user = user;
      res.send(`Welcome ${user.username}! You are now logged in.`);
    } else {
      res.send("Invalid password.");
    }
  });
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.send("You have been logged out.");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
