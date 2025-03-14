import mongoose from 'mongoose';

mongoose.connect("mongodb+srv://admin1:diamante1@cluster0.pb3n1pj.mongodb.net/mesasenvivo").then(() => console.log("Database is connected")).catch(error => console.error
    ("Connection error:", error));