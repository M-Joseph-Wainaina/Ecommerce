const User = require('../models/userModel');
const asyncHandler = require("express-async-handler");
import { generateToken } from '../config/jwtToken';
import { generateRefreshToken } from '../config/refreshToken';
import validateMongoDbId from '../utils/validateMongodbId';
const jwt = require('jsonwebtoken');


const createUser = asyncHandler(async (req, res) => {
    const { email }  = req.body;
    
    const findUser = await User.findOne({ email} );

    if (!findUser) {
        //create a new user
        const newUser = await User.create(req.body);
        res.status(200).send(newUser);
    }
    else{
        //user already exists
        throw new Error ('User Already Exists');
       // res.status(401).send({error: 'User exists', success: false});

    }
});

const loginUser = asyncHandler( async (req, res) => {
    const { email, password } = req.body;

    const findUser = await User.findOne({email});    
    
    if(
        findUser && 
        (await findUser.isPasswordMatched(password))
    )
    {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findOneAndUpdate(
            findUser?._id, 
            {refreshToken}
        )
        res.cookie(
            "refreshToken",
            refreshToken,
            { 
                htttpOnly: true,
                maxAge: 72 * 60 * 60 * 1000,
            }
        )
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.mobile,
            token: generateToken(findUser._id)
        });
    }
    else {
        throw new Error('Invalid Credentials')
    }
});

//handle refresh Token

const handleRefreshToken = asyncHandler(async (req, res) => {   
    
    const cookie = req.cookies;
    
    if (!cookie?.refreshToken) throw new Error('No refresh token'); 
    const refreshToken = cookie.refreshToken;
    
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No refresh Token");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id ) {
            throw new Error("There is something wrong with refresh Token");
        }
        const accessToken = generateRefreshToken(user?._id);
        res.json({ accessToken });
    });


});

//logout functionality

const logout = asyncHandler( async (req, res) => {
    const cookie = req.cookies;
    
    if (!cookie?.refreshToken) throw new Error('No refresh token'); 
    const refreshToken = cookie.refreshToken;
    
    const user = await User.findOne({ refreshToken });
    if(!user) {
        res.clearCookie(
            "refreshToken",
            {
                httpOnly: true,
                secure: true,
            });
        return res.status(204) //forbidden
    }
    await User.findOneAndUpdate({ refreshToken }, {
        refreshToken: ""
    });
    res.clearCookie(
        "refreshToken",
        {
            httpOnly: true,
            secure: true,
        });
    return res.sendStatus(204) //forbidden

});

//get all users

const getAllUsers = asyncHandler(async (req, res) => {
    try{
        const getUsers = await User.find();
        res.json(getUsers)
    } catch (error) {
        throw new Error(error);
    }
})

//get a single user

const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const getaUser = await User.findById(id);
        res.json(getaUser);
    } catch (error) {
        throw new Error(error);
    }
});

//update a user

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    
    try{
        const updateaUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        },
        {
            new: true,
        });
        res.json(updateaUser);
    } catch (error) {
        throw new Error(error);
    }
});

//delete a user

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json(deleteaUser);
    } catch (error) {
        throw new Error(error);
    }
});

const blockUser = asyncHandler(async (req, res) => {
    
    const { id } = req.params;
    validateMongoDbId(id);

    try{
       const blockedUser = await User.findByIdAndUpdate(id, 
        {
            isBlocked: true,
        },
        {
            new: true,
        });
        res.json({
            msg: "user blocked",    
        });

    } catch (error) {
        throw new Error(error);
    }
});

const unblockUser = asyncHandler(async (req, res) => {
    
    const { id } = req.params;
    validateMongoDbId(id);

    try{
       const blockedUser = await User.findByIdAndUpdate(id, 
        {
            isBlocked: false,
        },
        {
            new: true,
        });
        res.json({
            msg: "user unblocked",
        })

    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { 
    createUser, 
    loginUser, 
    getAllUsers, 
    getUser, 
    deleteUser,
    updateUser, 
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout
};

