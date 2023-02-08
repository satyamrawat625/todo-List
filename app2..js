//jshint esversion:6
//Install mongoose
const mongoose = require("mongoose");
 
// Run main function and catch error
main().catch((err) => console.log(err));

// async function
async function main() {
  //localhost ain't working because in config it's binding to 127.0.0.1
  const url = 'mongodb://127.0.0.1:27017';
  const dbPath = "/fruitsDB";

  mongoose.set('strictQuery', false);

  await mongoose.connect(url + dbPath, {
    useNewUrlParser: true,
  });

const fruitSchema = new mongoose.Schema ({
  name: {
    type:String,
    required:[true,"Plz check no name specified"]
    }, //makes name compulsory is & used to add additional msg if not present
  rating:{
    type: Number,
    min:1, 
    max:10
    },
  review: String
});
 
const Fruit = new mongoose.model("Fruit", fruitSchema);
 
const apple = new Fruit ({
  name: "Apple",
  rating: 7,
  review: "Pretty solid for a fruit."
});

const pineapple = new Fruit({
  name: "Pineapple",
  score:9,
  review: "great fruit" 
})

// pineapple.save() ;

// apple.save();
 
 


const cherry = new Fruit({
  name: "Cherry",
  rating: 3,
  review: "One was not enough :( ."
});
 
const banana = new Fruit({
  name: "Banana",
  rating: 5,
  review: "Weird texture."
});
 
const kiwi = new Fruit({
  name: "Kiwi",
  rating: 10,
  review: "The best fruit!"
});
 
// Fruit.insertMany([kiwi, cherry, banana], function(err){
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Succesfully saved all the fruits to fruitsDB");
//   }
// });
 
// Fruit.deleteMany({name:"Banana"},function (err) {
//   if(err)console.log(err);
//   else console.log("Done");
// })

// Fruits.deleteMany({name:"Kiwi"},function (err) {
//   if(err)console.log(err);
//   else console.log("Deleted");
// })

const personSchema = new mongoose.Schema ({
  name: String,
  age: Number,
  favouriteFruit: fruitSchema
});
 
const Person = new mongoose.model("Person", personSchema);


// const person = new Person ({
//   name: "Amy",
//   age: 37,
//   favouriteFruit: pineapple
// });
// person.save();
 

const person = new Person ({
  name: "John",
  age: 23,
  favouriteFruit: banana
});
person.save();

// Person.updateOne({name:"John"},{favouriteFruit:"mango"},function (err) {
//   if(err)console.log(err);
//   else console.log("DOne");
// })

// Fruit.find(function(err, fruits){
//   if (err) {
//     console.log(err);
//   } 
//   else {
//     mongoose.connection.close(function () {
//        process.exit(0);
//     });
 
//     fruits.forEach(function(fruit){
//         console.log(fruit.name);
//     });
//   }
// });
}   