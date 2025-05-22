import { Schema, model } from "mongoose";

const salesPokerSchema = new Schema ({

    player:{
        type: Schema.Types.ObjectId, ref:'Player'
    },
    cash:{
        type: Number,
        required:true,
    },
    name: {
        type:String,
        minLength:1,
        maxLength:30
    },
    credit:{
        type:Number,
        required:true
    },
    dollars:{
        type:Number,
        required:true,
    },
    rake:{
        type:Number,
        required:true
    },
    payment:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    time:{
        type:String,
        required:true
    }
})

export default model('SalePoker', salesPokerSchema)