const express = require("express");
const bodyParser = require("body-parser");
var request = require('superagent');
// const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const https = require("https");
const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req, res){
  res.sendFile(__dirname+"/signup.html");
});

var mailchimpInstance   = 'us17',
    listUniqueId        = '0f85675fff',
    mailchimpApiKey     = '16ba18688ed4f3218f59a75d2f1b7d8c-us17';

app.post("/", function (req, res) {
    request
        .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey ).toString('base64'))
        .send({
          'email_address': req.body.email,
          'status': 'subscribed',
          'merge_fields': {
            'FNAME': req.body.firstName,
            'LNAME': req.body.lastName
          }
        })
            .end(function(err, response) {
              if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
                res.sendFile(__dirname+"/success.html");
              } else {
                res.sendFile(__dirname+"/failure.html");
              }
          });
});
// mailchimp.setConfig({
// //*****************************ENTER YOUR API KEY HERE******************************
//  apiKey: "16ba18688ed4f3218f59a75d2f1b7d8c-us17",
// //*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
//  server: "us17"
// });

// app.post("/",function(req, res){
//
//   const firstName = req.body.fName;
//   const lastName = req.body.lName;
//   const email = req.body.email;
//
//   const listId = "0f85675fff";
//
//   const data = {
//
//     firstName: firstName,
//     lastName: lastName,
//     email: email
//     // members: [
//     //   {
//     //     email_address: email,
//     //     status: "subscribed",
//     //     merge_fields: {
//     //       FNAME: firstName,
//     //       LNAME: lastName
//     //     }
//     //   }
//     // ]
//   };
//
//   //Uploading the data to the server
//  async function run() {
// const response = await mailchimp.lists.addListMember(listId, {
//  email_address: data.email,
//  status: "subscribed",
//  merge_fields: {
//  FNAME: data.firstName,
//  LNAME: data.lastName
// }
// });
//
// res.sendFile(__dirname + "/success.html");
//  console.log(
// `Successfully added contact as an audience member. The contact's id is ${
//  response.id
//  }.`
// );
// }
// //Running the function and catching the errors (if any)
// // ************************THIS IS THE CODE THAT NEEDS TO BE ADDED FOR THE NEXT LESSON*************************
// // So the catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the faliure page
//  run().catch(e => res.sendFile(__dirname + "/failure.html"));
// });
// app.post("/failure",function(req,res){
//   res.redirect("/");
// });
//
// // const jsonData = JSON.stringify(data);
// //
// //   const url = "https://us17.api.mailchip.com/3.0/lists/0f85675fff";
// //
// //   const options = {
// //     method: "POST",
// //     auth: "abhi:16ba18688ed4f3218f59a75d2f1b7d8c-us17"
// //   }
// //
// //   const request = https.request(url, options, function(response){
// //
// //     if(response.statusCode === 200){
// //       res.sendFile(__dirname+"/success.html");
// //     }
// //     else{
// //       res.sendFile(__dirname+"/failure.html");
// //     }
// //
// //     response.on("data",function(data){
// //       console.log(JSON.parse(data));
// //     })
// //
// //   })
// //
// //   request.write(jsonData);
// //   request.end();
// // });

app.post("/failure",function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000");
});


//api key
// 16ba18688ed4f3218f59a75d2f1b7d8c-us17

//List id
// 0f85675fff
