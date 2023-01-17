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
      console.log('Successfully registered')
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
          console.log('verified')
          request.redirect('/motion_detection');
            
        }else{
          console.log('mali paren lods')
          output["status"]=0;
          output["message"]="Invalid password";
        }
    
      }else{
        console.log('invalid')
        output["status"]=0;
        output["message"]="Invalid username and password";
      }
      response.json(output)
    
      });
  })




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});