const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");

const app = express();
const jsonParser = express.json();
const mongoClient = new MongoClient("mongodb://127.0.0.1:27017/", { useUnifiedTopology: true });
 
let dbClient;
 
app.use(express.static(__dirname + "/public"));
 
mongoClient.connect().then(mongoClient => 
    {
        dbClient = mongoClient;
        const tmp = app.locals.collection = dbClient.db("passengersdb").collection("passengers");
        app.listen(3000, function(){
            console.log("Сервер очікує підключення...");
        });
    });
 
app.get("/api/passengers", function(req, res){
        
    const collection = req.app.locals.collection;
    collection.find().toArray().then((passengers) => {
        res.json(passengers)
    }).catch((err) => console.log(err));
     
});
app.get("/api/passengers/:id", function(req, res){
        
    const id = new ObjectId(req.params.id);
    const collection = req.app.locals.collection;

    collection.findOne({_id: id}).then(function(passenger){
        res.send(passenger);
    }).catch((err) => console.log(err));
});
   
app.post("/api/passengers", jsonParser, function (req, res) {
       
    if(!req.body) return res.sendStatus(400);
       
    const passengerFirstName = req.body.firstname;
    const passengerLastName = req.body.lastname;
    const passengerAge = req.body.age;
    const passengerPhone = req.body.phone;
    const passengerType = req.body.type;
    const passenger = {firstname: passengerFirstName, lastname: passengerLastName, age: passengerAge, phone: passengerPhone, type: passengerType};
       
    const collection = req.app.locals.collection;
    collection.insertOne(passenger).then(function(result){
        res.json(passenger);
    }).catch((err) => console.log(err));
});
    
app.delete("/api/passengers/:id", function(req, res){
        
   const id = new ObjectId(req.params.id);
    const collection = req.app.locals.collection;

    collection.findOneAndDelete({_id: id}).then(function(result){    
        let passenger = result.value;
        res.send(passenger);
    }).catch((err) => console.log(err));
});
   
app.put("/api/passengers", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = new ObjectId(req.body.id);
    const passengerFirstName = req.body.firstname;
    const passengerLastName = req.body.lastname;
    const passengerAge = req.body.age;
    const passengerPhone = req.body.phone;
    const passengerType = req.body.type;

    const collection = req.app.locals.collection;
    collection.findOneAndUpdate({ _id: id }, 
        { $set: {firstname: passengerFirstName, lastname: passengerLastName, age: passengerAge, phone: passengerPhone, type: passengerType} },
        { returnNewDocument: true },).then(function(result){   
            const  passenger = result.returnNewDocument;
            res.send(passenger);
        }).catch((err) => console.log(err));
    });
 
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});
