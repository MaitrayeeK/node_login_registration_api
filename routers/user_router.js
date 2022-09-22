const router = require("express").Router() // Importing express router for use the routes
const bcrypt = require("bcrypt") // Used for password hashing
const { check, validationResult } = require('express-validator') // Used for data validation
const jwt = require("jsonwebtoken")
const checktoken = require("../middleware/checktoken")
const User = require("../models/user") // Importing model's file for database ops

// Registration of user https://localhost:8080/user/register
router.post("/register", [
    // Validation of user data
    check('name').not().isEmpty().withMessage('Please provide name.'),
    check('email').isEmail().withMessage('Please enter valid email').not().isEmpty().withMessage('E-mail is required.'),
    check('password').isLength({ min:4 }).withMessage("Password must be grater than 4 characters.").not().isEmpty().withMessage('Please provide password.')
],
// Using asynchronous function for send the responses
async (req,res)=>{
    try {
        // If errors in user validation than send the errors
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() });
        }
        
        // Encrypt the password of user for security
        const hash_pass = await bcrypt.hash(req.body.password, 10)

        // Check if user is already exists or not
        let user = await User.findOne({ email:req.body.email });
        if(user) {
           return res.send({ message: "User already exists with this email.", result: false})
        }
        user =  new User ({
            name: req.body.name,
            email: req.body.email,
            password: hash_pass,
            role: req.body.role
        })
        // Used await for wait for the operation to be done
        let result = await user.save();
        const data = {
            user:{
                id : user.id
            }
        }

        // Creating jwt token for authentication
        const authToken = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '3600s' })
        result = {
            authtoken: authToken 
        }
        res.send({ message: "Registration successfully completed.", data: result, result: true}); 
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Exception ocurred while registration.", result: false})
    }
})

// Login of user https://localhost:8080/user/login
router.post("/login", 
// Validation of user data
check('email').not().isEmpty().withMessage('E-mail is required.'),
check('password').not().isEmpty().withMessage('Please provide password.') , 
async (req,res) => {
    try {
        // Check user data
        let user = await User.findOne({ email:req.body.email });
        if(user) {
            // Comparing hash password
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if (err) {
                    return res.send({ message: "An error occurred.", result: false})
                } else if (isMatch) {
                    const data = {
                        user:{
                            id : user.id
                        }
                    }

                    // Creating jwt token for authentication
                    const authToken = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '3600s' })
                    user = {
                        authtoken: authToken 
                    }
                    return res.send({ message: "Logged in successfully", data: user, result: true})
                } else {
                    return res.send({ message: "Your password is incorrect", result: false})
                }
            })
        } else {
            return res.send({ message: "Invalid credentials.", result: false })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Exception ocurred while login.", result: false})
    }
})

// Get user data with token authentication of user https://localhost:8080/user/register
router.post("/getuser", checktoken,
// Using asynchronous function for send the responses
async (req,res)=>{
    try {
        userid = req.user.id
        const user = await User.findById(userid).select("-password")
        res.send({ data: user, result: true})
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Internal error ocurred.", result: false})
    }
})

// Exporting router to import in anywhere
module.exports = router