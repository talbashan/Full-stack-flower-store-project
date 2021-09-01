const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;

const CustomersSchema = new Schema(
    {
        name: {type:String, require:true},
        color: {type:String, require:true},
        image: {type:String, require:true},
        price: {type:String, require:true}
    }
);
const customers = mongoose.model('customers',CustomersSchema);
module.exports = customers;