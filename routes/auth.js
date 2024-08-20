import express from "express";
import User from "../models/User.js"
import Crypto from "crypto-js";
const router = express.Router();
import jwt from "jsonwebtoken";

//REGISTER
router.post("/register", async (req,res)=>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: Crypto.AES.encrypt(req.body.password, process.env.PASS_KEY).toString()
    })
    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }catch(err){
        res.status(500).json(err);
    }
});

//LOGIN
router.post("/login", async(req,res)=>{
    try{
        const user = await User.findOne({username: req.body.username}); // Mencari data dari DB yang terdapat{username: query dari body}
        if(!user){
            res.status(401).json("Wrong credentials!");
            return;
        }; //Membuat kondisi apakah nilai user ditemukan | jika ditemukan maka kondisi ini diabaikan | jika nilai user falsy maka akan di eksekusi

        const hasedPassword = Crypto.AES.decrypt(user.password, process.env.PASS_KEY).toString(Crypto.enc.Utf8);

        if(hasedPassword !== req.body.password){
            res.status(401).json("Wrong Credentials!");
            return;
        }; // Membuat kondisi apakah nilai password dari query user sama dengan input dari client/req.body.blbla | jika salah maka kondisi dijalankan
        const {password, ...others} = user._doc; //membuat destruction untuk memisahkan nilai password dari user
        const accessToken = jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.JWT_KEY, {expiresIn: "3d"}); // Membuat accesToken menggunakan module jswebtoken

        res.status(200).json({...others, accessToken});// Jika semua kondisi false maka jalan kan baris ini dengan respon ..others yang sudah dipisah dengan password dan accesToken
    }catch(err){
        res.status(500).json(err)// jika eror kembalikan parameter err
    }
})


export default router;