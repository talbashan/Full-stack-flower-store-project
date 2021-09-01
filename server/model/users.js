const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;
//passportLocalMongoose = require('passport-local-mongoose');

const usersSchema = new Schema(
    {
        location: {type:String, require:true},
        id: {type:String, require:true},
        firstname: {type:String, require:true},
        lastname: {type:String, require:true},
        username: {type:String, require:true},
        mail: {type:String, require:true},
        password: {type:String, require:true},
        gender: {type:String, require:true},
        type: {type:String, require:true},
        snifId: {type:String, require:true},
        active: {type:String, require:true}
    }
);

// usersSchema.plugin(passportLocalMongoose);

const users = mongoose.model('users',usersSchema);
module.exports = users;

