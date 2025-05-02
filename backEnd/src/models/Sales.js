import { Schema, model } from "mongoose";

const saleSchema = new Schema({

   
    player:{
        type:Schema.Types.ObjectId, ref:'Player'
    },
    user:{
        type:Schema.Types.ObjectId, ref:'User'
    },
    cashIn:{
        type:Number,

    },
    cash:{
        type:Number,
     
    },
    name:{
        type:String,

        minLength:1,
        maxLength:30
    },
    credit:{
        type:Number,
       
    },
    dollars:{
        type:Number,
        
    },
    payment:{
        type:Number,
    },
    date:{
        type:Date,
     
    },

    time:{
        type:String,
  
    }





}




)

export default model("Sale", saleSchema);