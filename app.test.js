// server.js
import express from 'express';
import { initializeModel, predict } from './utlis/predictionModel.js';
import { calcBillSerice } from './service/billing.js';
import { generateSummary } from './service/summary.js';
import { predictionSerice } from './service/predictionSerice.js';
import {checkForOutagesAndNotify} from './service/notification.js'


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let model;

// Initialize the model when the server starts
// Mocking the model initialization for testing purposes
jest.mock('./utlis/predictionModel.js', () => ({
  initializeModel: jest.fn(() => Promise.resolve({})),
  predict: jest.fn(() => Promise.resolve(50)), // Mocking a sample predicted bill
}));

jest.mock('./service/billing.js', () => ({
  calcBillSerice: jest.fn(() => 40.23), // Mocking a sample calculated bill
}));

jest.mock('./service/summary.js', () => ({
  generateSummary: jest.fn(() => Promise.resolve('This is a mock summary.')),
}));

jest.mock('./service/predictionSerice.js', () => ({
  predictionSerice: jest.fn(() => Promise.resolve(45.67)), // Mocking a sample predicted bill
}));

jest.mock('./service/notification.js', () => ({
  checkForOutagesAndNotify: jest.fn(() => Promise.resolve('This is a mock outage response.')),
}));

initializeModel()
  .then(loadedModel => {
    model = loadedModel;
    console.log('Model initialized successfully.');
  })
  .catch(error => {
    console.error('Error initializing model:', error);
  });

// Define a test customer object
const testCustomer = {
  plan: 'Premium',
  minutes: 250,
  dataUsage: 8,
  smsCount: 120,
};

describe('Server API Endpoints', () => {
  it('should calculate the total bill', async () => {
    const res = await request(app)
      .post('/total-bill')
      .send(testCustomer);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('bill');
  });

  it('should generate a billing summary', async () => {
    const res = await request(app)
      .post('/bill-Summary')
      .send(testCustomer);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('summary');
  });

  it('should predict the bill', async () => {
    const res = await request(app)
      .post('/predict-bill')
      .send(testCustomer);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('predictedBill');
  });

  it('should check for outages', async () => {
    const res = await request(app)
      .post('/Outages')
      .send({ region: 'Test Region', phoneNumber: '+15555551212' });

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('This is a mock outage response.');
  });
});
