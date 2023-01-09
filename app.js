//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser")
const mongoose = require ("mongoose");
const _=require("lodash");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://illuminada:test1234@cluster0.5esdm3p.mongodb.net/todolistDB");
//mongodb+srv://illuminada:<password>@cluster0.5esdm3p.mongodb.net/?retryWrites=true&w=majority
const itemsSchema = {
  name:String
};
const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
name: "Welcome to your todolist!"
});

const item2 = new Item({
name: "Hit the + button to add a new item."
});

const item3 = new Item({
name: "<-- Hit this to delete an item."
});
const defaultItems = [item1, item2, item3];
const listSchema = {
name: String,
items: [itemsSchema]
};
const List = mongoose.model("List", listSchema) ;



//Item. insertMany(defaultItems, function(err){
//if  (err){
//console. log(err);
//}else {

//onsole. log("Successfully saved default items to DB");

//}

//});-->


//nst items = ["Buy Food", "Cook Food", "Eat Food"];c//nst workItems = [];

app.get("/", function(req, res) {

Item.find({}, function(err, foundItems){//
if (defaultItems.length ===0){
    Item.insertMany(defaultItems, function(err){
      //if(defaultItems.length === 0){
    if (err){
    console. log(err);
    }else {
      console.log("Successfully saved to the DB");}
    });
res.redirect("/");
    }


//Item.find({}, function(err, foundItems){
else{
  res.render("list", {listTitle: "Today", newListItems: foundItems});
}
});
});

app.post("/", function(req, res){
const itemName = req.body.newItem;
const listName = req.body.list;
const item = new Item({
name:itemName
});

if (listName === "Today"){
  item.save();
  res.redirect("/");

}else{
  List.findOne({name:listName}, function(err, foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/" + listName);
  });
}
});


app.get("/:customListName", function(req, res){
const customListName= _.capitalize(req.params.customListName);
console.log(customListName);
List.findOne({name:customListName}, function(err, foundList){
if(!err){
if(!foundList){
  const list = new List({
  name: customListName,
  items: defaultItems});
  list.save();
  res.redirect("/" + customListName);}
else{
  res.render("list", {listTitle: foundList.name , newListItems: foundList.items} );
}
}
});

//list.save();
});
app.post("/delete", function(req, res){
  const checkeditemId = req.body.checkbox;
  console.log(checkeditemId);
  const listName = req.body.listName;
  console.log(listName);
  if (listName == "Today"){
    Item.findByIdAndRemove(checkeditemId, function(err){
      if(!err){
        console.log("Successfully deleted checked item");
        res.redirect("/");
      }
    } );
  }else{
    List.findOneAndUpdate({name:listName}, {$pull: {items:{_id:checkeditemId}}},function(err, foundList){
      if(!err){
        res.redirect("/" + listName);
      }
    });

  }

});

app.get("/work", function(req,res){
  Item. find({}, function(err, foundItems){
  console. log(foundItems) ;

});



  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT||3000, function() {
  console.log("Server started on port 3000");
});
