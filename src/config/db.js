const {connect} = require("mongoose");

const connectDb = async (DB_URL) => {
    try{
        await connect(DB_URL);
        console.log("Database connected successfully");
        
    }catch(err){
        console.log("Database connection error", err); 
    }
}

module.exports = connectDb