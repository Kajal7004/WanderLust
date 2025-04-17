// google dns server/ Override system dns issue
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session"); //For Session manage
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")


//Require LIsting route
const listingsRouter = require("./routes/listing.js");

// Require review route 
const reviewsRouter = require("./routes/review.js");

//User SignUp Router
const userRouter = require("./routes/user.js")


//Database connection
const MONGO_URL = "mongodb://localhost:27017/wanderlust";
// const dbUrl = process.env.MONGO_URI;
main() 
.then(() => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(MONGO_URL);
    // console.log(dbUrl)
}


//EJS setup

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


//For session options to not get depreciated warning

const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    // mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("Mongo session error", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

//Home Route
// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });


//use Session
app.use(session(sessionOptions));
//For display flash msg when something new added & it is also above from route
app.use(flash());

//For Authentication or Authorization
app.use(passport.initialize()); //A middleware that initiilize passport
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //When the session start it starts seriliazation becase storing info
passport.deserializeUser(User.deserializeUser()); // When we end the session the delete the session data


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
});

//Demouser for Passport cHeck
// app.get("/demoUser", async (req, res) => {
//     let fakeUser = new User({
//         email: "Student@gmail.com",
//         username: "delta-students"
//     });
//     let registeredUser = await User.register(fakeUser, "Ranjan")
//     res.send(registeredUser);
// })


//for Listing route
app.use("/listings", listingsRouter)


//for Review route
app.use("/listings/:id/reviews", reviewsRouter);


//for User signup router
app.use("/", userRouter);




//Test Listing
// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "calicut, kolkata",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Succesfull Testing")
// })


//Custom Express Error
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!!"));
})


//Middleware

//Only for WrapAsync

// app.use((err, req, res, next) => {
//     res.send("Something went wrong!")
// })

//Express Error
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!!" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
})


app.listen(8080, () => {
    console.log("Server is listining to port 8080");
});


