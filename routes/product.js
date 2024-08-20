import express from "express";
import Product from "../models/Product.js";
import { verifyToken, authorizationToken, authorizationTokenAdmin } from "./verifytoken.js";

const router = express.Router();

//CREATE PRODUCT
router.post("/", authorizationTokenAdmin, async (req,res)=>{
    const newProduct = new Product(req.body);
    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    }catch(err){
        res.status(500).json(err);
    }
});

//UPDATE PRODUCT
router.put("/:id", authorizationTokenAdmin, async (req, res)=>{
    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{
            $set: req.body, // "*$ set * adalah untuk syntax mongose untuk mengisi objek yg akan di update 
        }, {new:true}); //new adalah option findByIdAndUpdate untuk membuat setelah doc diperbarui jika dipanggil akan mengembalikan nilai terupdate nya;

        res.status(200).json(updatedProduct);
    } catch(err){
        res.status(500).json(err);
    }
});

//DELETE PRODUCT
router.delete("/:id", authorizationTokenAdmin, async (req,res)=>{
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted.")
    } catch (err) {
        res.status(500).json(err.message);
    }
})

//GET PRODUCT
router.get("/find/:id", async(req,res)=>{
    try {
        const productList = await Product.findById(req.params.id);
        res.status(200).json(productList);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

//GET ALL PRODUCTS
router.get("/", async(req,res)=>{
    try {
        const qNew = req.query.new;
        const qCat = req.query.category;
        let result
        if(qNew){
            result = await Product.find().sort({createdAt: -1}).limit(5);
        }else if(qCat){
            result = await Product.find({
                categories: {
                    $in : [qCat],
                }
            });
        } else{
            result = await Product.find();
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err.message);
    }
});





export default router;