const { Schema, model } = require('mongoose');

const memberSchema = new Schema({
   email: String,
    birthday: String,
    ward: String,        
    stake: String,
    firstName: String,
    lastName: String,
    memberNum: String
}, { collection: 'members' });

const Member = model('Member', memberSchema);
module.exports = { Member };