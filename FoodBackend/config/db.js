import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://inyomee2002:%24%23%21Inyo2002@cluster0.tlartwu.mongodb.net/Inyomee3').then(() => console.log("DB CONNECTED"))
}