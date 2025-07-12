import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

 // Configuration
 cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret:  process.env.CLOUDINARY_SECRET
});

const upploadOncluodinary = async (file_path) => {
    try {
        if (!file_path) return null;

    // Upload file on Cloudinary

    const result = await cloudinary.uploader.upload(file_path, {
        resource_type: 'auto'
    });


    fs.unlinkSync(file_path)
    return result

    
    
    // fs.unlinkSync(file_path)

    } catch (error) {
        fs.unlinkSync(file_path); // remove the locally uploaded  temporary file as the upload operation got failed 
        console.log(error);
        return null;
        
    }


}

export {upploadOncluodinary};