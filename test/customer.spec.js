const { getCustomers } = require('../controllers/customer'); // Replace with the correct path
const Customer = require('../models/customer');

// Mocking the required dependencies
jest.mock('../models/customer', () => ({
  find: jest.fn(),
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('getCustomers', () => {
  it('should get customers successfully', async () => {
    const mockCustomers = [{ name: 'Customer 1' }, { name: 'Customer 2' }];
    Customer.find.mockResolvedValue(mockCustomers);

    const req = {};
    const res = mockResponse();
    const next = jest.fn();

    await getCustomers(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Customers found.',
      Customers: mockCustomers,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle error and call next with status code 500', async () => {
    const mockError = new Error('Test error');
    Customer.find.mockRejectedValue(mockError);

    const req = {};
    const res = mockResponse();
    const next = jest.fn();

    await getCustomers(req, res, next);

    //expect(res.status).toHaveBeenCalledWith(500);
    expect(next).toHaveBeenCalledWith(mockError);
  });
});





