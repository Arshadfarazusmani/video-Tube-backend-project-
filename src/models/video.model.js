import mongoose from "mongoose";
import mongoose_Aggregate_Paginate from "mongoose-aggregate-paginate-v2";

const VideoSchema = new mongoose.Schema(
    {
        videoFile:{
            type: String, // cloudinary url
            required: true,
        },
        thumbnail:{
            type: String, // cloudinary url
            required: true,
        },
        title:{
            type: String,
            required: true,
            
            
        },
        description:{
            type: String,
            required: true,
        },
        duration:{
            type: Number,
            required: true,
        },
        views:{
            type: Number,
            default: 0,
        },
        isPublished:{
            type: Boolean,
            default: true,
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

    },{timestamps: true});



    VideoSchema.plugin(mongoose_Aggregate_Paginate);  // to write Aggregate query


export const Video = mongoose.model("Video", VideoSchema);