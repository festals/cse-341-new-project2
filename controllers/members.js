const {Member} = require('../models/members');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Members']
    try {
    if (req.query.triggerError === 'true') {
      throw new Error('Artificial Error for demonstration');
    }
    const lists = await Member.find();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Members']
 try {
    const memberId = new ObjectId(req.params.id);
    const lists = await Member.findById(memberId);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createMember = async(req, res) => {
    //#swagger.tags=['Members']
    try {
    const member = new Member ({
        email: req.body.email,
        birthday: req.body.birthday,
        ward: req.body.ward,        
        stake: req.body.stake,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        memberNum: req.body.memberNum
    });

      const response = await member.save();

    if (response) {
      res.status(201).json(response);
    } else {
      res.status(500).json('Some error occurred while creating the member.');
    }
  } catch (error) {
    next(error);
  }
};

const updateMember = async(req, res) => {
    //#swagger.tags=['Members']
    const memberId = new ObjectId(req.params.id);
    const member = {
        email: req.body.email,
        birthday: req.body.birthday,
        ward: req.body.ward,        
        stake: req.body.stake,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        memberNum: req.body.memberNum
    };

   const response = await Member.findByIdAndUpdate(memberId, member, { new: true });

  if (response) {
    res.status(200).json(response);
  } else {
    res.status(500).json('Some error occurred while updating the member.');
  };
};


const deleteMember = async(req, res) => {
    //#swagger.tags=['Members']
    const memberId = new ObjectId(req.params.id);
    const response = await Member.findByIdAndDelete(memberId);

    if(response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some Error occurred while deleting the member.')
    };
}

module.exports = {
    getAll,
    getSingle,
    createMember,
    updateMember,
    deleteMember
};