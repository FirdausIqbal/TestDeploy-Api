import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";
import productsRoute from "./routes/product.js";

dotenv.config(); //Untuk menjalankan file .env dan mengakesnya

const app = express();
const port = 3000;


mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log("DB Connect Successful")})
.catch((err)=>{console.log(err.message);}) // Membuat Connection ke MongoDB 


app.use(express.urlencoded({extended: true}))
app.use(express.json()); //Untuk mengandle middleware dengan format JSON
app.use("/api/auth", authRoute); // Memamnggil Setiap routes yang sudah di buat di .routes
app.use("/api/user", userRoute);
app.use("/api/products", productsRoute);

//process.env.PORT menggunakan nilai port dari env* jika tidak ada /false gunakan variabel port
app.listen(process.env.PORT || port, ()=>{
    console.log("Server Run on Port 3000");
})