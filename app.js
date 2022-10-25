const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://admin-darshan:$$dar$$123@cluster0.0seyjfy.mongodb.net/todolist"
);

// mongoose.connect("mongodb://localhost:27017/todolist" );

const itemschema = {
  name: String,
};
const Item = mongoose.model("Item", itemschema);

const item1 = new Item({
  name: "make a tea",
});
const item2 = new Item({
  name: "read a book",
});
const item3 = new Item({
  name: "write a nots",
});
const defaultitem = [item1, item2, item3];

var today = new Date();
var option = {
  weekday: "long",
  day: "numeric",
  month: "long",
};
var day = today.toLocaleDateString("en-US", option);

app.get("/", function (req, res) {
  Item.find({}, function (err, result) {
    if (result.length === 0) {
      Item.insertMany(defaultitem, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("sucessfully added");
        }
        res.redirect("/");
      });
    } else {
      res.render("list", { kindaofday: day, newlistitem: result });
    }
  });

  /*   var currentday = today.getDay();
    var day = " "
  switch (currentday) {
        case 0:
            day = "sunday"
            break;
        case 1:
            day = "monday"
            break;
        case 2:
            day = "tuesday"
            break;
        case 3:
            day = "wednesday"
            break;
        case 4: 
            day = "thusday"
            break;
        case 5:
            day = "friday"
            break;
        case 6:
            day = "saturday"
            break;
        default:
            console.log("current dat is  "+ currentday);
    }*/
});

app.post("/", function (req, res) {
  const listitem = req.body.newItem;
  const item = new Item({
    name: listitem,
  });
  item.save();

  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const checkeditemid = req.body.checkbox;

  Item.findByIdAndRemove(checkeditemid, function (err) {
    if (!err) {
      console.log("removed");
      res.redirect("/");
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server is goes up and runong on port 3000 ..");
});
