const express = require('express');
const router = express.Router();
const { 
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
} = require('../controller/userController');

const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.post("/register", createUser);
router.post("/login", loginUser);

//get all users
router.get("/all-users",getAllUsers);

//handle refresh token
router.get('/refresh', handleRefreshToken);

//logout
router.get('/logout', logout);

//get a user
router.get("/:id", authMiddleware, isAdmin, getUser);

//delete a user
router.delete("/:id", deleteUser)

//update user info
router.put("/edit-user", authMiddleware, updateUser);

//block and unblock a user
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);



module.exports = router;