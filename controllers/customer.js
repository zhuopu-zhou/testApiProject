const { validationResult } = require('express-validator');

const Customer = require('../models/customer');

exports.getCustomers = async (req, res, next) => {
  try {
    const Customers = await Customer.find();
    res.status(200).json({ message: 'Customers found.', Customers: Customers });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }

    const customer = new Customer({
      fName: req.body.fName,
      lName: req.body.lName,
      midName: req.body.midName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      address: req.body.address 
    });

    const result = await customer.save();
    res.status(201).json({
      message: 'Customer created successfully!',
      post: result
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCustomer = async (req, res, next) => {
  try {
    const customerId = req.params.customerId;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      const error = new Error('Could not find customer.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'Customer found.', customer: customer });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }

    const customerId = req.params.customerId;
    const updatedCustomer = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      const error = new Error('Could not find customer.');
      error.statusCode = 404;
      throw error;
    }

    customer.fName = updatedCustomer.fName;
    customer.lName = updatedCustomer.lName;
    customer.midName = updatedCustomer.midName;
    customer.phoneNumber = updatedCustomer.phoneNumber;
    customer.email = updatedCustomer.email;
    customer.address = updatedCustomer.address;

    await customer.save();
    res.status(200).json({ message: 'Customer updated.', customer: customer });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const customerId = req.params.customerId;
    await Customer.findByIdAndRemove(customerId);
    res.status(200).json({ message: 'Customer deleted.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

