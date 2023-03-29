const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();


const passengerScheme = new Schema(
    {firstname: String,
    lastname: String,
    age: Number,
    phone: Number,
    type: {
        type: String,
        enum : ['Common', 'Business','Luxury'],
        default: 'Common'
    } 
    }, {versionKey: false});

const Passenger = mongoose.model("Passenger", passengerScheme);

app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://127.0.0.1:27017/passengersdb", { useUnifiedTopology: true, useNewUrlParser: true})
.then(() => {
app.listen(3000, function(){
console.log("Сервер ожидает подключения...");
});
})
.catch((err) => {
console.log(err);
});

app.get("/api/passengers", function(req, res){
        
    Passenger.find({})
    .then((users) => {
        res.send(users);
    })
    .catch((err) => {
        console.log(err);
    });
});
   
app.get("/api/passengers/:id", function(req, res){
         
    const id = req.params.id;
    Passenger.findOne({_id: id})
        .then((passenger) => {
            res.send(passenger);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post("/api/passengers", jsonParser, function (req, res) {
        
    if(!req.body) return res.sendStatus(400);
    
    const passengerFirstName = req.body.firstname;
    const passengerLastName = req.body.lastname;
    const passengerAge = req.body.age;
    const passengerPhone = req.body.phone;
    const passengerType = req.body.type;
    const passenger = new Passenger({firstname: passengerFirstName, lastname: passengerLastName,
    age: passengerAge, phone: passengerPhone, type: passengerType});
        
    passenger.save()
        .then(() => {
            res.send(passenger);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.delete("/api/passengers/:id", function(req, res){
         
    const id = req.params.id;
    Passenger.findByIdAndDelete({_id: id})
        .then((passenger) => {
            res.send(passenger);
        })
        .catch((err) => {
            console.log(err);
        });
});

         
    app.put("/api/passengers", jsonParser, function(req, res){

            if(!req.body) return res.sendStatus(400);
            const id = req.body.id;
            const passengerFirstName = req.body.firstname;
            const passengerLastName = req.body.lastname;
            const passengerAge = req.body.age;
            const passengerPhone = req.body.phone;
            const passengerType = req.body.type;
            const updateFields = {
                firstname: passengerFirstName, 
                lastname: passengerLastName,
                age: passengerAge, 
                phone: passengerPhone, 
                type: passengerType
            };
        
            Passenger.findOneAndUpdate({_id: id}, updateFields, {new: true})
                .then((passenger) => {
                    res.send(passenger);
                })
                .catch((err) => {
                    console.log(err); 
                });
        });
    

process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});
