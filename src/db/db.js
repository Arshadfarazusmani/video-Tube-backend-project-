import mongoose from 'mongoose';
import {DB_name} from '../constant.js';

const DB_URI=process.env.MongoDB_URI

const DB_connect= async ()=>{
    try {
        const connectionInstance= await mongoose.connect(`${DB_URI}/${DB_name}`)
        console.log(`Database connected to ${connectionInstance.connection.name}`);

        
    } catch (error) {
        console.log('DB_connect error:',error)
        process.exit(1)
        
    }
}

export {DB_connect}