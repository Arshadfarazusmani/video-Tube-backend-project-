import mongoose from "mongoose"
import { User } from "./users.model"

const Subscribtion_Schema= new mongoose.Schema({

    subscriber:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },

    channel:{
        type:Schema.Types.ObjectId,
        ref:"User"

    }

    

},{timestamps:true})

export const subscibtion = mongoose.model("subscribtion",Subscribtion_Schema)