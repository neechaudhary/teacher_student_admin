const mongoose= require("mongoose");

const paperSchema = new mongoose.Schema({
    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
    },
    body:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
        enum: ["pending", "reviewed"],
    },


}, {timestamps: true});
module.exports= mongoose.model("Paper", paperSchema);