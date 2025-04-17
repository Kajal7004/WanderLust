const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


//Database connection
const MONGO_URL = "mongodb://localhost:27017/wanderlust";
main() 
.then(() => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(MONGO_URL);
}


const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj, owner: "6772ae9064dcd2e4855e7fb3"
  }))
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
