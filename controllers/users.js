const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Users']
    try {
    if (req.query.triggerError === 'true') {
        throw new Error('Artificial Error for demonstration');
    }
    const result = await mongodb.getDatabase().db('project2').collection('users').find();
    result.toArray().then((users) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    });
    }catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Users']
    try {
    const itemId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db('project2').collection('users').find({ _id:itemId });
    result.toArray().then((users) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users[0]);
    });
    } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createUser = async(req, res) => {
    //#swagger.tags=['Users']
    try {
    const user = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    };

    const response = await mongodb.getDatabase().db('project2').collection('users').insertOne(user);

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
    const user = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    };

    const response = await mongodb.getDatabase().db('project2').collection('users').replaceOne({_id: userId}, user);

    if(response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some Error occurred while updating the user.')
    };
};

const deleteUser = async(req, res) => {
    //#swagger.tags=['Users']
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db('project2').collection('users').deleteOne({_id: userId});

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