require("dotenv").config() // dontenv file for configuration
const express = require('express') // Adding express
const cors = require("cors") // If client and server has different origin

const user_router = require("./routers/user_router") // Importing user_router file
const app = express() // Express object
app.use(express.urlencoded({extended: true})) // Url middleware parse the incoming requestes based on body-parser
app.use(express.json()) // Parses incoming JSON requests and puts the parsed data in req. body 
app.use(cors())

//User registration and signup route
app.use("/user", user_router)

app.listen(8080) // Server will be https://localhost:8080