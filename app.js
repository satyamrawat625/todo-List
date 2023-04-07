//jshint esversion:6
require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser");
const date= require(__dirname+ "/date.js")
const app= express() ;
const mongoose = require("mongoose")
const _ = require("lodash")

app.set("view engine",'ejs')//tells our app to use ejs as view engine
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

const dbPath = "/todolistDB";

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URL+dbPath);

const itemsSchema = new mongoose.Schema({
    name:String
})

const Item= mongoose.model("Item",itemsSchema)

const item1= new Item({
    name: "Welcome to ur to-do list" 
})

const item2 = new Item({
    name:"Hit the + button to off a new item"
})

const item3= new Item({
    name: "<-- Hit this to delete an item"
})

const defaultItems= [item1,item2,item3]

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List",listSchema)

let workItems=[]

app.get("/",function (req,res) {
    // let day =date.getDate()
    
    Item.find({},function(err,foundItems) {
        if(foundItems.length==0){

            Item.insertMany(defaultItems,function (err) {
                if(err)console.log(err);
                else console.log("Items saved to DB");
            })
            res.redirect("/")
        }
        else res.render("list",{listTitle:"Today" , newListItems:foundItems})

    })
})

app.post("/",function (req,res) {
    const itemName= req.body.newItem//content of notes
    const listName= req.body.list //name of page eg work, home
    

    const item = new Item({
        name: itemName
    })

    if(listName=== "Today"){//ie if we r in default list
        item.save()
        setInterval(1000);//time taken to save in mongodb ,otherwise new item wont be instantly rendered
        res.redirect("/")
    }
    else{
        List.findOne({name: listName },function (err,foundList){
            foundList.items.push(item) 
            foundList.save() 

            res.redirect("/"+listName)
        })
    }
})

app.post("/delete",function (req,res) {
    const checkedItemId= req.body.checkbox;
    const listName= req.body.listName

    
    if(listName==="Today"){//default list
        Item.findByIdAndRemove(checkedItemId,function (err) {
            if(!err){
                console.log("sucessfully deleted");
                res.redirect("/")
            }
        })
    }
    else{//custom list

        List.findOneAndUpdate({name:listName},{$pull:{items: {_id: checkedItemId} }},function (err,foundList) {
            if(!err)res.redirect("/"+listName)
        })
    }
})


app.get("/:customListName",function (req,res) {
   const customListName= _.capitalize(req.params.customListName)
   


    List.findOne({name:customListName}, function (err,foundList) {
        if(!err){
            if(!foundList){//create new list

                const list= new List({
                    name : customListName,
                    items: defaultItems
                })
            
                list.save()
                res.redirect("/"+customListName)
            }
            else{//show existing list
                res.render("list",{listTitle: foundList.name , newListItems:foundList.items})
            }
        }
    })
    
})

app.get("/work",function (req,res) {
    res.render("list",{listTitle: "Work List", newListItems:workItems })
})

app.get("/about",function(req,res) {
    res.render("about")
})

app.listen(3000,function () {
    console.log("Server started on port 3000");
})

