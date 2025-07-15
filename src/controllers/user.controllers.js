import {asynchandler} from '../utils/async-handler.js';
import {api_error} from '../utils/api-error.js';
import {User} from '../models/users.model.js';
import {upploadOncluodinary} from '../utils/cloudinary.js';
import {api_response}from '../utils/api-response.js';

const generateAccessTokenAndRefreshToken = async(user_id)=>{
    console.log("Attempting to generate tokens for user_id:", user_id); // Log the ID being used

    const user = await User.findById(user_id); // This is the line that fetches the user

    // --- ADD THIS CHECK ---
    if (!user) {
        console.error("ERROR: User not found with ID:", user_id); // Crucial log
        throw new api_error(404, "User not found for token generation.");
    }
    // --- END ADDED CHECK ---

    console.log("User found:", user.username, user.email); // Confirm user object is retrieved

    const accessToken= user.generateAccessToken(); // Ensure it's called as a function
    const refreshToken= user.generateRefreshToken(); // Ensure it's called as a function

    user.refreshToken=refreshToken;

    await user.save({validateBeforeSave:false});


    

    return {accessToken , refreshToken};
};
 

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

const loginUser = asynchandler(async (req , res) => {
    // req.body -> data 
    // username or email
    // find user
    // check password 
    // access token refresh token 
    // send cookie

    const {email,password} = req.body;

    if (!email) {
        throw new api_error(400,"Email is required");
    }

    // Find user by email, explicitly select password for comparison
    const user = await User.findOne({email}).select('+password'); // Ensure password is selected for comparison

    if(!user){
        throw new api_error(404,"User does not exist or invalid credentials");
    }

    // Compare the provided password with the stored hashed password
    const is_password_Valid = await user.comparePassword(password);

    if(!is_password_Valid){
        throw new api_error(401,"Invalid credentials (incorrect password)");
    }

    // Generate access and refresh tokens
    const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id);

    // Fetch the logged-in user again, excluding password and refresh token for the response
    // Use .lean() to get a plain JavaScript object to avoid circular reference errors
    const loggedIn_User = await User.findById(user._id).select("-password -refreshToken").lean();

    // No need for .toObject() here because .lean() already returns a plain JS object
    // const plain_js_Object_loggedin_user = loggedIn_User.toObject(); // REMOVED THIS LINE

    const options = {
        httpOnly: true,
        secure: false // Set to true in production if using HTTPS
        // sameSite: 'None' // Consider adding this for cross-site cookie handling if needed
    };

    // Send cookies and JSON response
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new api_response(
                200,
                {
                    user: loggedIn_User, // Use the plain JavaScript object directly
                    accessToken,
                    refreshToken
                },
                "User logged in successfully!!"
            )
        );
});


const logOutUser=asynchandler(async(req, res )=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: false
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new api_response(200, {}, "User logged Out"))




});


export {
    registerUser,
    loginUser,
    logOutUser


};