import { Schema, model } from "mongoose";

const smsSchema = new Schema({
    numbers: {
        type: [String], // ✅ Un array de strings
        required: true
    },
    message: {
        type: String, // ✅ Un string
        required: true
    }
});

export default model("Sms", smsSchema);
