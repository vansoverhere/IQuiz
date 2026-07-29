import mongoose from "mongoose";

export const connectDB=async ()=>{
    await mongoose.connect("mongodb+srv://vanshika188211c_db_user:XxLP5uxmOAS3PGrs@cluster0.kdarxsx.mongodb.net/IQuiz")
    .then(()=>{
        console.log("DB CONNECTED")
    })
}