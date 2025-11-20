const express= require('express');
const router = express.Router();

const validation = require('../middleware/validator.js')
const membersController = require('../controllers/members.js');

router.get('/', membersController.getAll);

router.get('/:id', membersController.getSingle);

router.post('/', validation.memberValidationRules(), validation.validate, membersController.createMember);

router.put('/:id', validation.memberValidationRules(), validation.validate, membersController.updateMember);

router.delete('/:id', membersController.deleteMember);

module.exports = router;