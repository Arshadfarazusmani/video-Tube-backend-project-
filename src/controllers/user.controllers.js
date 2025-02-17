import {asynchandler} from '../utils/async-handler.js';

const registerUser = asynchandler(async (req , res) => {
//    1 get the user data from the frontend . 
//    2 Validation - not empty , valid email , password length , password match
//    3 check if the user already exists in the database (from email or username according to neeed) 
//    4 check for images
//    5 pload them to cloudinary
//    6 crate user object 
//    7 save the user object to the database
//    8 remove password and refresh tokens fields from the  response object
//    9 check  for user creation and send the response.

res.body()




});

export {registerUser};