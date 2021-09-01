const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;
passportLocalMongoose = require('passport-local-mongoose');

const workersSchema = new Schema(
    {
        location: { type: String, require: true },
        id: { type: String, require: true },
        firstname: { type: String, require: true },
        lastname: { type: String, require: true },
        username: { type: String, require: true },
        mail: { type: String, require: true },
        gender: { type: String, require: true },
        password: { type: String, require: true },
        lat: { type: String, require: true },
        long: { type: String, require: true },
        workdays: {
            type: Array, uniqueItems: true,
            items: { type: Boolean }
        },
        admin: { type: Boolean, require: false }
    }
);

workersSchema.plugin(passportLocalMongoose);

const workers = mongoose.model('workers', workersSchema);
module.exports = workers;

