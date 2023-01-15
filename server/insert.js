const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const port = 2023;

app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "data",
  });


// CREATE(insert)
app.post("/insert", (req, res) => {
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  // const { username, email, password } = req.body;
  connection.query(
    "INSERT INTO users (username, email, password) VALUES (?,?,?)",
    [username, email, password],
    (err, results) => {
      try {
        if (results.affectedRows > 0) {
          res.json({ message: "Data has been added!" });
        } else {
          res.json({ message: "Something went wrong." });
        }
      } catch (err) {
        res.json({ message: err });
      }
    }
  );
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

