// https://stackoverflow.com/questions/59475620/cant-display-an-image-with-ejs-file-in-node-js
// https://dev.to/yogesnsamy/how-to-add-custom-css-javascript-files-to-an-expressjs-app-48cp
const axios  = require("axios");
var express = require("express");
var path = require("path")
  var app = express();
  app.use(express.static(path.join(__dirname, "public")))
//setting view engine to ejs
app.set("view engine", "ejs");

//route for index page
app.get("/", function (req, res) {
  const id = req.query.id
  res.render("home", {
    id
  });
});
app.get("/bet", function (req, res) {
  const userId = req.query.id
  res.render("bet", {
    userId
  });
});
//route for magic page
app.get("/magic", function (req, res) {
  // const bet = req.params.balance
  const bet = req.query.bet
  const userId = req.query.id
  // console.log("bet", bet)
  axios.get('https://www.khadmty1.com/api/WalletApi/GetGameCalc')
  .then((data)=>{
    console.log("data", data.data)
    let income = data.data.incomeBalance;
    let outcome = data.data.outcomeBalance;
    let target = data.data.targetPercent;
    let x = parseInt(outcome)/parseInt(income);
    x = x * 100;
    if(x <= target){
      console.log("Won!")
      axios.post('https://www.khadmty1.com/api/WalletApi/GameResult',{
        "ApplicationUserId":`${userId}`,
        "Result": true,
        "Balance": bet
      })
      .then((data)=>{
        console.log("data", data.data)
        res.render("index", {
          won: true
        })
      })
    } else {
      console.log("Lost!")
    }
  })
  .catch((err)=> console.error(err))

});

app.listen(8080, function () {
  console.log("Server is running on port 8080 ");
});