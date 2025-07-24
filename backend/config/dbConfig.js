const mongoose=require("mongoose")
const express =require("express");




const dbConnector=async()=>{
    try {
        const dbUrl=process.env.DBURL;

        const db_connect_status=await mongoose.connect(dbUrl);
        if(!dbConnector)
        {
            console.error("issue with the DB connection ");
        }
        console.log("DB Connected successfully");
        
    } catch (error) {
        console.log("Error with DB Connection "+error);
        throw error;
    }
}

module.exports= dbConnector;