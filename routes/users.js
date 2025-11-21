const express= require('express');
const router = express.Router();

const usersController = require('../controllers/users.js');
const { userValidationRules, validate } = require('../middleware/validator.js');
const { isAuthenticated } = require('../middleware/authenticate.js');

router.get('/',  isAuthenticated, usersController.getAll);

router.get('/:id', isAuthenticated, usersController.getSingle);

router.post('/', userValidationRules(), validate, usersController.createUser);

router.put('/:id', isAuthenticated, userValidationRules(), validate, usersController.updateUser);

router.delete('/:id', isAuthenticated, usersController.deleteUser);

module.exports = router;