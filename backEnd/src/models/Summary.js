import { Schema, model } from "mongoose";

const summarySchema = new Schema({

    player:{type:Schema.Types.ObjectId, ref:'Player'},
    totalCash:{
        type:Number,
        default:0
    },
    totalCredit:{
        type:Number,
        default:0
    },
    totalDollars:{
        type:Number,
        default:0
    },
    totalPayment:{
        type:Number,
        default:0
    },
    netwin:{
        type:Number,
        default:0
    }
});

export default model('Summary', summarySchema);

