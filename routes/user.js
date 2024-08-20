import express from "express";
import Crypto from "crypto-js";
import {verifyToken, authorizationToken, authorizationTokenAdmin} from "./verifytoken.js";
import User from "../models/User.js";
const router = express.Router();
//UPDATE
router.put("/:id", authorizationToken, async (req,res)=>{
    if(req.body.password){
        req.body.password = Crypto.AES.decrypt(req.body.password, process.env.PASS_KEY).toString();
        console.log(req.body.password);
    };
    try{
        const updateduser = await User.findByIdAndUpdate(req.params.id,{
            $set: req.body,
        }, {new:true});

        res.status(200).json(updateduser);
    } catch(err){
        res.status(500).json(err);
    }
});

//DELTE
router.delete("/:id", authorizationToken, async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);// mencari model Mongo yang memiliki id tsb. dan menangkap nilai params dari http, jika ditemukan Delete model tsb.
        res.status(200).json("User Has been delete ...");
    }catch(err){
        res.status(500).json(err);
    }
});

//GET USER
router.get("/find/:id", authorizationTokenAdmin, async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);//mencari model mongo dengan nilai id dari url params http request
        const {password, ...others} = user._doc; //destruction perator untuk memisah objek masing2 ke dalam variabel *disini property password dipisah dari property lainya diambil dari object user._doc;
        res.status(200).json(others);
        
    }catch(err){
        res.status(500).json(err);
    }
});


//GET ALL USER
router.get("/", authorizationTokenAdmin, async(req,res)=>{
    const query = req.query.new; //menangkap nilai query new pada http params yg biasanya *url?nama_query=valuenya*
    try{
        const user = query ? await User.find().sort({_id:-1}).limit(5) : await User.find(); //kodisi operator ternary* apakah ini true ? jika benar disini : jika salah disini;*
        res.status(200).json(user);//response nilai user
    }catch(err){
        res.status(500).json(err);
    }
});

//GET STATS
router.get("/stats", authorizationTokenAdmin, async (req,res)=>{
    const date = new Date();
    const lastyear = new Date(date.setFullYear(date.getFullYear() - 1));
    try{
        const data = await User.aggregate([ //melakukan penggabungan data dan buat group baru untuk memuat data baru *seperti SQL JOIN klo di postgre
            { $match: {createdAt: {$gte: lastyear}}},
            {$project : 
                {month: 
                    {$month : "$createdAt"},
                },},
            {$group:{
                _id: "$month",
                total: {$sum:1},
            },}
        ]);
        res.status(200).json(data);
    }catch(err){
        res.status(500).json(err)
    }
})

//setelah dibuat jangan lupa untuk di export karena modul ini akan di muat di app.js
export default router;