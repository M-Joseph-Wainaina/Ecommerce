const User = require('../models/userModel');
const asyncHandler = require("express-async-handler");
import { generateToken } from '../config/jwtToken';

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
    try{
        const getaUser = await User.findById(id);
        res.json(getaUser);
    } catch (error) {
        throw new Error(error);
    }
});

//update a user

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try{
        const updateaUser = await User.findByIdAndUpdate(id, {
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
    try{
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json(deleteaUser);
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
    updateUser
};