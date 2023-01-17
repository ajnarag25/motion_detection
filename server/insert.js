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
    const repassword = req.body.repass
    const bcrypt = require('bcryptjs');
    const salt = bcrypt.genSaltSync(10);
    const encrypt = await bcrypt.hash(password, salt)

    if(username == "" || email == "" || password == ""){
      res.send({ message: "Please fill up the necessary informations needed" });
    }else if(password != repassword){
      res.send({ message: "Password does not match" });
    }else{
      res.send({ message: "Successfully Registered" });
      connection.query(
        "INSERT INTO users (username, email, password) VALUES (?,?,?)", [username, email, encrypt],
      );
    }

});

  app.post("/read", (request, response) => {
    const user = request.body.username
    const pass = request.body.password
    console.log(user)
    const query="SELECT password from users where username=?";
    const params=[user]
    connection.query(query,params,(err,rows) => {
      if(err) throw err;
      //
      var output={}
      if(rows.length!=0)
      {
        var password_hash=rows[0]["password"];
        const bcrypt = require('bcryptjs');
        const verified = bcrypt.compareSync(pass, password_hash);
        if(verified)
        {
          output["status"]=1;
          output["message"]="Verified";
          console.log('verified')
        }else{
          console.log('invalid credentials')
          output["status"]=0;
          output["message"]="Invalid password";
        }
    
      }else{
        console.log('invalid')
        output["message"]="Invalid username and password";
      }
      response.json(output)
    
      });
  })

  app.post("/find", (request, response) => {
    const email = request.body.email

    const query="SELECT * from users where email=?";
    const params=[email]
    connection.query(query,params,(err,rows) => {
      if(err) throw err;
      //
      var output={}
      if(rows.length!=0)
      {
        console.log('Email found')
        output["message"]="Email found";
    
      }else{
        console.log('could not find email')
        output["message"]="Could not find email";
      }
      response.json(output)
    
      });
  })

  app.post("/change", (request, response) => {
    const password = req.body.password
    const repassword = req.body.repass
    const query="SELECT * from users where email=?";
    const params=[email]
    connection.query(query,params,(err,rows) => {
      if(err) throw err;
      //
      var output={}
      if(rows.length!=0)
      {
        console.log('Email found')
        output["message"]="Email found";
    
      }else{
        console.log('could not find email')
        output["message"]="Could not find email";
      }
      response.json(output)
    
      });
  })



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});