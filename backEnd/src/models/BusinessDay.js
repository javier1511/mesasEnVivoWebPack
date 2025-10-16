import { Schema, model } from "mongoose"

const businessDaySchema = new Schema({
    status:{type:String, enum:["open", "closed"], required:true, default:"open"},
    date:{type:String, required:true, unique:true},
    closeBy: {type:Schema.Types.ObjectId, ref:"User"}
}, {timestamps:true});

businessDaySchema.index({ status: 1 });

export default model("BusinessDay", businessDaySchema);