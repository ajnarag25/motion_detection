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
app.post("/insert", async(req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const bcrypt = require('bcryptjs');
    const salt = bcrypt.genSaltSync(10);
    const encrypt = await bcrypt.hash(password, salt)
        // const { username, email, password } = req.body;
    connection.query(
        "INSERT INTO users (username, email, password) VALUES (?,?,?)", [username, email, encrypt],
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

  // app.post("/read", (request, response) => {
  //   const req=request.query
  //   const query="SELECT password from users where username=?";
  //   const params=[req.username]
  //   connection.query(query,params,(err,rows) => {
  //     if(err) throw err;
  //     //
  //     var output={}
  //     if(rows.length!=0)
  //     {
  //       var password_hash=rows[0]["password"];
  //       const verified = bcrypt.compareSync(req.password, password_hash);
  //       if(verified)
  //       {
  //         output["status"]=1;
  //       }else{
  //         output["status"]=0;
  //         output["message"]="Invalid password";
  //       }
    
  //     }else{
  //       output["status"]=0;
  //       output["message"]="Invalid username and password";
  //     }
  //     response.json(output)
    
  //     });
  // })




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});