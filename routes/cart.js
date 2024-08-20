import express from "express";
import {verifyToken, authorizationToken, authorizationTokenAdmin} from "./verifytoken.js";
import Cart from "../models/Cart.js";
const router = express.Router();

//CREATE CART
router.post("/", verifyToken, async(req,res)=>{
    const dataCart = new Cart(req.body);
    try{
        const result = await dataCart.save();
        res.status(200).json(result);
    }catch(err){
        res.status(500).json(err.message);
    }
});

//UPDATE CART
router.put("/:id", authorizationToken, async(req,res)=>{
    try{
        const cartUpdate = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, {new: true});
        res.status(200).json(cartUpdate);
    }catch(err){
        res.status(500).json(err.message);
    }
});

//DELETE CART
router.delete("/:id", authorizationToken, async (req,res)=>{
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart Has Been Deleted.")
    } catch (err) {
        res.status(500).json(err.message);
    }
});

//GET USER CART
router.get("/find/:userid", authorizationToken, async(req,res)=>{
    try{
        const result = await Cart.findOne({userid: req.params.userid});
        res.status(200).json(result);
    }catch(err){
        res.status(500).json(err.message);
    };
})

//GET ALL USER CART *ADMIN ONLY
router.get("/", authorizationTokenAdmin, async(req,res)=>{
    try{
        const listCart = await Cart.find();
        res.status(200).json(listCart);
    }catch(err){
        res.status(500).json(err.message);
    }
});