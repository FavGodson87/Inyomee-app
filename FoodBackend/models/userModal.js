import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type:String, required:true},
    name: { type: String, required: true },
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    favorites: [{type:mongoose.Schema.Types.ObjectId, ref: "Item"}],
    rewardProgress: {
    type: Number,
    default: 0
  },

    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { timestamps: true } ) 

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel