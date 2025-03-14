    import { Schema, model } from 'mongoose';

    const playerSchema = new Schema({
        name: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 30
        },
        areamobile: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        curp: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        }
    }, {
        timestamps: true,
        versionKey: false
    });

    // Exportación correcta del modelo
    export default model("Player", playerSchema);
