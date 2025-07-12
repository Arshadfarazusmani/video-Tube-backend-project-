import {asynchandler} from '../utils/async-handler.js';
import {api_error} from '../utils/api-error.js';
import {User} from '../models/users.model.js';
import {upploadOncluodinary} from '../utils/cloudinary.js';
import {api_response}from '../utils/api-response.js';

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

const {username,email,fullname,password}=req.body

console.log(username,email,fullname,password);

if(!username || !email || !fullname || !password){
    throw new api_error(400,"Please fill all the fields");}

    const existedUser = await User.findOne({$or:[{username},{email}]});

    if(existedUser){
        throw new api_error(409,"User already exists");


 };

   const avatarlocalpath =  req.files?.avatar[0]?.path;  
    const coverImagelocalpath =  req.files?.coverImage[0]?.path;

//   let coverImageLocalPath;

//     if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
//         coverImageLocalPath = req.files.coverImage[0].path
//     }

   if(!avatarlocalpath){
       throw new api_error(400,"Please upload an avatar image");
   }


  const avatar =  await upploadOncluodinary(avatarlocalpath);
  const coverImage= await upploadOncluodinary(coverImagelocalpath);

  if(!avatar){
      throw new api_error(400,"Avatar is required"); 
  }
  if(!coverImage){
      throw new api_error(400,"Cover is required"); 
  }


const user=await User.create({
    username: username.toLowerCase(),
    email,
    fullname,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url||" ",
});

const createduser =await User.findById(user._id).select("-password -refreshToken");

if(!createduser){
    throw new api_error(500,"User creation failed");



}

res.status(201).json(new api_response(200,"User created successfully",createduser));




});




export {registerUser};