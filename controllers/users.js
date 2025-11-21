const { User } = require('../models/users');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcryptjs');

const getAll = async (req, res) => {
    //#swagger.tags=['Users']
    try {
    if (req.query.triggerError === 'true') {
        throw new Error('Artificial Error for demonstration');
    }
   const lists = await User.find();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
    }catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Users']
    try {
    const userId = new ObjectId(req.params.id);
    const lists = await User.findById(userId);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
    } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createUser = async(req, res) => {
    //#swagger.tags=['Users']
    try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
    };

    const response = await user.save();

    if(response.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some Error occurred while creating the user.')
    };
    } catch (error) {
    next(error);
  }
};

const updateUser = async(req, res) => {
    //#swagger.tags=['Users']
    const userId = new ObjectId(req.params.id);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
    };

    const response = await User.findByIdAndUpdate(userId, user, { new: true });

    if(response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some Error occurred while updating the user.')
    };
};

const deleteUser = async(req, res) => {
    //#swagger.tags=['Users']
    const userId = new ObjectId(req.params.id);
    const response = await User.findByIdAndDelete(userId);

    if(response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some Error occurred while deleting the user.')
    };
};

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};