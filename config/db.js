const mongoose = require('mongoose') // Importing for database connection

// Connection to the mongodb
mongoose.connect(process.env.DBURL)
var db = mongoose.connection

// If error while connecting to database
db.on("error",(err)=>{
    console.log(err)
})

// Exporting mongoose connection to import in anywhere
module.exports = mongoose