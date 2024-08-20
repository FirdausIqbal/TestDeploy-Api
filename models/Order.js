import mongoose from "mongoose";

const OderSchema = new mongoose.Schema({
    userid:{type: String, required: true, unique: true},
    products:[
        {productId: 
            {type: Number}, quantity:{type: Number, default:1}
        }
    ],
    amount:{ type: Number, required: true},
    address: { type: Object, required:true},
    status:{ type: String, default: "Pending"},
},  {timestamps: true});

module.exports = mongoose.model("Oder", OderSchema);