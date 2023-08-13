const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema(
  {
    fName: {
      type: String,
      required: true
    },
    lName: {
      type: String,
      required: true
    },
    midName: {
      type: String,
      required: false
    },
    phoneNumber: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
