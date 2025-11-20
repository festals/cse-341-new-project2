const express= require('express');
const router = express.Router();

const usersController = require('../controllers/users.js');
const { userValidationRules, validate } = require('../middleware/validator.js');

router.get('/', usersController.getAll);

router.get('/:id', usersController.getSingle);

router.post('/', userValidationRules(), validate, usersController.createUser);

router.put('/:id', userValidationRules(), validate, usersController.updateUser);

router.delete('/:id', usersController.deleteUser);

module.exports = router;