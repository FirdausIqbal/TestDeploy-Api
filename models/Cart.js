import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    userid:{type: String, required: true, unique: true},
    products:[
        {productId: 
            {type: Number}, quantity:{type: Number, default:1}
        }
    ]   
},  {timestamps: true});

const Cart = mongoose.model("Cart", CartSchema);
export default Cart; 