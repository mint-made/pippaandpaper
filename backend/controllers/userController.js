import asyncHandler from 'express-async-handler';

import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

// @description Auth user & get token
// @route POST /api/users/login
// @access Public
/**
 * @api {post} /api/users/login authUser
 *  @apiGroup User
 * @apiPermission Public
 *
 * @apiParam {String} email Email submitted by the user trying to log in
 * @apiParam {String} password Password submitted by the user trying to log in
 *
 * @apiSuccess {String} _id ID of the user
 *  @apiSuccess {String} name Name of the user
 *  @apiSuccess {String} email Email of the user
 *  @apiSuccess {Boolean} isAdmin Does the user have admin rights?
 *  @apiSuccess {String} token Token created with JWT for the user to access Private routes in the site
 */
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @description Register a new user
// @route POST /api/users
// @access Public
/**
 * @api {post} /api/users registerUser
 * @apiGroup User
 * @apiPermission Public
 *
 * @apiParam {String} name Name submitted by the user creating an account
 * @apiParam {String} email Email submitted by the user creating an account
 * @apiParam {String} password Password submitted by the user creating an account
 *
 * @apiSuccess {String} _id ID of the user
 *  @apiSuccess {String} name Name of the user
 *  @apiSuccess {String} email Email of the user
 *  @apiSuccess {Boolean} isAdmin Does the user have admin rights? Defaults to false
 *  @apiSuccess {String} token Token created with JWT for the user to access Private routes
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @description Get user profile
// @route POST /api/users/profile
// @access Private
/**
 * @api {post} /api/users/profile getUserProfile
 * @apiGroup User
 * @apiPermission Private
 *
 *
 * @apiSuccess {String} _id ID of the user
 *  @apiSuccess {String} name Name of the user
 *  @apiSuccess {String} email Email of the user
 *  @apiSuccess {Boolean} isAdmin Does the user have admin rights?
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @description Update user profile
// @route PUT /api/users/profile
// @access Private
/**
 * @api {put} /api/users/profile updateUserProfile
 * @apiGroup User
 * @apiPermission Private
 *
 * @apiParam {String} name updated name of the user
 * @apiParam {String} email updated email of the user
 * @apiParam {String} password updated password of the user
 *
 * @apiSuccess {String} _id _id of the user
 *  @apiSuccess {String} name updated name of the user
 *  @apiSuccess {String} email updated email of the user
 *  @apiSuccess {Boolean} isAdmin Does the user have admin rights?
 *  @apiSuccess {String} token Token created with JWT for the user to access Private routes
 
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @description Get all users profiles
// @route GET /api/users/
// @access Private/Admin
/**
 * @api {get} /api/users getUsers
 * @apiGroup User
 * @apiPermission Private/Admin
 *
 * @apiSuccess {Array} users Returns all users
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  res.json(users);
});

// @description Delete user
// @route DELETE /api/users/:id
// @access Private/Admin
/**
 * @api {delete} /api/users/:id deleteUser
 * @apiGroup User
 * @apiPermission Private/Admin
 *
 * @apiParam {String} _id _id of the user to be deleted
 *
 * @apiSuccess {Object} message "User removed"
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @description Get user by ID
// @route GET /api/users/:id
// @access Private/Admin
/**
 * @api {get} /api/users/:id getUserById
 * @apiGroup User
 * @apiPermission Private/Admin
 *
 * @apiParam {String} _id _id of the user
 *
 * @apiSuccess {Object} user All of the users information ex. password
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @description Update user
// @route PUT /api/users/:id
// @access Private/Admin
/**
 * @api {put} /api/users/:id updateUser
 * @apiGroup User
 * @apiPermission Private/Admin
 *
 * @apiParam {String} name updated name of the user
 *  @apiParam {String} email updated email of the user
 *  @apiParam {String} isAdmin updated admin status of the user
 *
 * @apiSuccess {String} _id _id of the user
 * @apiSuccess {String} name updated name of the user
 *  @apiSuccess {String} email updated email of the user
 *  @apiSuccess {String} isAdmin updated admin status of the user
 */
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  console.log(req.body.isAdmin);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
