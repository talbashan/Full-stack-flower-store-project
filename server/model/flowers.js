const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;

const flowersSchema = new Schema(
    {
        name: {type:String, require:true},
        color: {type:String, require:true},
        image: {type:String, require:true},
        price: {type:String, require:true}
    }
);
const flowers = mongoose.model('flowers',flowersSchema);
module.exports = flowers;