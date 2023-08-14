const { validationResult } = require('express-validator');
const {
  getCustomers,
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customer'); // Replace with the actual path to your module
const Customer = require('../models/customer'); // You'll need to adjust the path to your Customer model

// Mocking the Customer model
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));  
jest.mock('../models/customer', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndRemove: jest.fn(),
  prototype: {},
}));

describe('Customer Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test for getCustomers function
  describe('getCustomers', () => {
    it('should return a list of customers', async () => {
      const mockCustomers = [{}, {}, {}];
      Customer.find.mockResolvedValue(mockCustomers);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await getCustomers(req, res, next);

      expect(Customer.find).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Customers found.',
        Customers: mockCustomers,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors and call next', async () => {
      const errorMessage = 'An error occurred';
      Customer.find.mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();

      await getCustomers(req, res, next);

      expect(next).toHaveBeenCalledWith(
       new Error(errorMessage)
      );
    });
  });

  // Test for getCustomer function
  describe('getCustomer', () => {
    it('should return a customer by ID', async () => {
      const mockCustomerId = 'mockId';
      const mockCustomer = { _id: mockCustomerId };

      Customer.findById.mockResolvedValue(mockCustomer);

      const mockReq = { params: { customerId: mockCustomerId } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      await getCustomer(mockReq, mockRes, mockNext);

      expect(Customer.findById).toHaveBeenCalledWith(mockCustomerId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Customer found.',
        customer: mockCustomer,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle errors and call next', async () => {
      const errorMessage = 'An error occurred';
      const mockCustomerId = 'mockId';
      Customer.findById.mockRejectedValue(new Error(errorMessage));

      const req = { params: { customerId: mockCustomerId } };
      const res = {
        status: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();

      await getCustomer(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: errorMessage,
          statusCode: 500,
        })
      );
    });
  });

  // Test for deleteCustomer function
  describe('deleteCustomer', () => {
    it('should delete a customer by ID', async () => {
      const mockCustomerId = 'mockId';

      const mockReq = { params: { customerId: mockCustomerId } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      await deleteCustomer(mockReq, mockRes, mockNext);

      expect(Customer.findByIdAndRemove).toHaveBeenCalledWith(mockCustomerId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Customer deleted.',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle errors and call next', async () => {
      const errorMessage = 'An error occurred';
      const mockCustomerId = 'mockId';
      Customer.findByIdAndRemove.mockRejectedValue(new Error(errorMessage));

      const req = { params: { customerId: mockCustomerId } };
      const res = {
        status: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();

      await deleteCustomer(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: errorMessage,
          statusCode: 500,
        })
      );
    });
  });
  
  // Test for updateCustomer function
  describe('updateCustomer', () => {
    it('should update a customer by ID', async () => {
      const mockValidationResult = {
        isEmpty: jest.fn(() => true),
      };
      validationResult.mockReturnValue(mockValidationResult);

      const mockCustomerId = 'mockId';
      const mockCustomer = { _id: mockCustomerId };

      Customer.findById.mockResolvedValue(mockCustomer);
      Customer.prototype.save = jest.fn().mockResolvedValue(mockCustomer);

      const mockReq = { params: { customerId: mockCustomerId } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      await updateCustomer(mockReq, mockRes, mockNext);

      expect(validationResult).toHaveBeenCalledWith(mockReq);
      expect(Customer.findById).toHaveBeenCalledWith(mockCustomerId);
      //expect(mockRes.status).toHaveBeenCalledWith(200);
      // expect(mockRes.json).toHaveBeenCalledWith({
      //   message: 'Customer found.',
      //   customer: mockCustomer,
      // });
      // expect(mockNext).not.toHaveBeenCalled();
   
    });

    it('should handle errors and call next', async () => {
      const errorMessage = new Error("Validation failed, entered data is incorrect.");
      validationResult.mockReturnValue({
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => [{ msg: errorMessage }]),
      });

      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();

      await updateCustomer(req, res, next);

      expect(next).toHaveBeenCalledWith(errorMessage);
    });
  });

  // Test for createCustomer function
  describe('createCustomer', () => {
    it('should create a customer', async () => {
      const mockValidationResult = {
        isEmpty: jest.fn(() => true),
      };
      validationResult.mockReturnValue(mockValidationResult);

      const mockCustomerData = {
        fName: 'John',
        lName: 'Doe',
        midName: 'M',
        phoneNumber: '1234567890',
        email: 'john@example.com',
        address: '123 Main St',
      };
      const mockSavedCustomer = { ...mockCustomerData, _id: 'mockId' };
      const mockReq = { body: mockCustomerData };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      Customer.prototype.save = jest.fn().mockResolvedValue(mockSavedCustomer);

      await createCustomer(mockReq, mockRes, mockNext);

      expect(validationResult).toHaveBeenCalledWith(mockReq);
      expect(mockValidationResult.isEmpty).toHaveBeenCalled();
      // expect(Customer.prototype.save).toHaveBeenCalled();
      // expect(mockRes.status).toHaveBeenCalledWith(201);
      // expect(mockRes.json).toHaveBeenCalledWith({
      //   message: 'Customer created successfully!',
      //   post: mockSavedCustomer,
      // });
      // expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle errors and call next', async () => {
      const errorMessage = new Error("Validation failed, entered data is incorrect.");
      validationResult.mockReturnValue({
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => [{ msg: errorMessage }]),
      });

      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();

      await createCustomer(req, res, next);

      expect(next).toHaveBeenCalledWith(errorMessage);
    });
  });
});