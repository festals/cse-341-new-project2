const express= require('express');
const router = express.Router();

const validation = require('../middleware/validator.js')
const membersController = require('../controllers/members.js');
const { isAuthenticated } = require('../middleware/authenticate.js');

router.get('/', membersController.getAll);

router.get('/:id', membersController.getSingle);

router.post('/', isAuthenticated, validation.memberValidationRules(), validation.validate, membersController.createMember);

router.put('/:id', isAuthenticated, validation.memberValidationRules(), validation.validate, membersController.updateMember);

router.delete('/:id', isAuthenticated, membersController.deleteMember);

module.exports = router;