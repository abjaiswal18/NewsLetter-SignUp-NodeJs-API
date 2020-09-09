const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req, res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req, res){

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us17.api.mailchip.com/3.0/lists/0f85675fff";

  const options = {
    method: "POST",
    auth: "abhi:16ba18688ed4f3218f59a75d2f1b7d8c-us17"
  }

  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }

    response.on("data",function(data){
      console.log(JSON.parse(data));
    })

  })

  request.write(jsonData);
  request.end();
});

app.post("/failure",function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000");
});

// --data @- \
// <<EOF | jq '.id'
// {
//   "name": "$event_name",
//   "contact": $footer_contact_info,
//   "permission_reminder": "permission_reminder",
//   "email_type_option": true,
//   "campaign_defaults": $campaign_defaults
// }
// EOF

//api key
// 16ba18688ed4f3218f59a75d2f1b7d8c-us17

//List id
// 0f85675fff
