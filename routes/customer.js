const express = require('express');
const { body } = require('express-validator');

const customerController = require('../controllers/customer');

const router = express.Router();

// GET /customer/getAll
router.get('/getAll', customerController.getCustomers);

// POST /customer/create
router.post(
  '/create',
  [
    body('phoneNumber')
      .trim()
      .isNumeric(),
    body('email')
      .trim()
      .isEmail()
  ],
  customerController.createCustomer
);

// GET/customer/get
router.get('/get/:customerId', customerController.getCustomer);

// PATCH /customer/get
router.patch(
  '/update/:customerId',  
  [
    body('phoneNumber')
      .trim()
      .isNumeric(),
    body('email')
      .trim()
      .isEmail()
  ],
  customerController.updateCustomer);

// DELETE /customer/get
router.delete('/delete/:customerId', customerController.deleteCustomer);

module.exports = router;
