const mongoose =require("../config/db") // Importing config file for database connection

// Collection schema(structure of document)
var UserSchema = mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true},
    password: String
})

// Model of users collection
var User = mongoose.model('users',UserSchema)
User.createIndexes()
// Exporting User model to import in anywhere
module.exports = User