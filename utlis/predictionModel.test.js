// Install TensorFlow.js before running: npm install @tensorflow/tfjs
import * as tf from '@tensorflow/tfjs';
import fs from 'fs';
import { predict, initializeModel } from './predictionModel.js'; // Assuming the function is in 'predictionModel.js'

// Helper function to load data for testing
function loadData(filePath) {
  const csvData = fs.readFileSync(filePath, 'utf8').split('\n').map(row => row.split(','));
  
  const X = [];
  const y = [];
  const plans = [];
  
  // Skipping header row and assuming data starts from index 1
  for (let i = 1; i < csvData.length; i++) {
    const [customerID, minutesUsed, dataUsedGB, smsCount, plan, billAmount] = csvData[i];
    if (!minutesUsed || !dataUsedGB || !smsCount || !billAmount) continue;  // Skip incomplete rows
    X.push([Number(minutesUsed), Number(dataUsedGB), Number(smsCount)]);
    plans.push(plan);  // Collect plans for encoding later
    y.push(Number(billAmount));
  }

  // One-hot encode the 'Plan' column
  const uniquePlans = Array.from(new Set(plans));
  const planMap = {};
  uniquePlans.forEach((plan, index) => planMap[plan] = index);
  const encodedPlans = plans.map(plan => {
    const oneHot = new Array(uniquePlans.length).fill(0);
    oneHot[planMap[plan]] = 1;
    return oneHot;
  });
  
  // Merge the encoded plan with X
  for (let i = 0; i < X.length; i++) {
    X[i] = X[i].concat(encodedPlans[i]);
  }

  // Normalize features (minutes, data, SMS)
  X.forEach((row, i) => {
    row[0] = (row[0] - Math.min(...X.map(r => r[0]))) / (Math.max(...X.map(r => r[0])) - Math.min(...X.map(r => r[0]))); // Normalize MinutesUsed
    row[1] = (row[1] - Math.min(...X.map(r => r[1]))) / (Math.max(...X.map(r => r[1])) - Math.min(...X.map(r => r[1]))); // Normalize DataUsedGB
    row[2] = (row[2] - Math.min(...X.map(r => r[2]))) / (Math.max(...X.map(r => r[2])) - Math.min(...X.map(r => r[2]))); // Normalize SMSCount
  });

  return { X: tf.tensor2d(X), y: tf.tensor2d(y, [y.length, 1]) , planMap: planMap};
}

describe('Prediction Model', () => {
  let model;
  let testData;
  let planMap;

  beforeAll(async () => {
    // Initialize the model and load test data once before all tests
    model = await initializeModel();
    testData = loadData('c:/Users/Mezeruy/Desktop/Capstone GenAI/utlis/data.csv'); // Load your test data
    planMap = testData.planMap; // Get the planMap from testData
  });

  it('should predict bill amount within a reasonable range', async () => {
    // Prepare test input
    const minutesUsed = 250;
    const dataUsedGB = 8;
    const smsCount = 120;
    const plan = 'premium'; // Example plan
    const planEncoding = [0, 0, 0];
    planEncoding[planMap[plan]] = 1;
    const newInput = [minutesUsed, dataUsedGB, smsCount, ...planEncoding];

    // Normalize the input data
    newInput[0] = (newInput[0] - Math.min(...testData.X.arraySync().map(r => r[0]))) / (Math.max(...testData.X.arraySync().map(r => r[0])) - Math.min(...testData.X.arraySync().map(r => r[0])));
    newInput[1] = (newInput[1] - Math.min(...testData.X.arraySync().map(r => r[1]))) / (Math.max(...testData.X.arraySync().map(r => r[1])) - Math.min(...testData.X.arraySync().map(r => r[1])));
    newInput[2] = (newInput[2] - Math.min(...testData.X.arraySync().map(r => r[2]))) / (Math.max(...testData.X.arraySync().map(r => r[2])) - Math.min(...testData.X.arraySync().map(r => r[2])));

    const predictedBill = await predict(model, newInput);

    // Define reasonable range based on your data and model performance
    expect(predictedBill).toBeGreaterThanOrEqual(10); // Example lower bound
    expect(predictedBill).toBeLessThanOrEqual(100); // Example upper bound
  });

  // Add more test cases to cover different scenarios:
  // - Test with different plan types
  // - Test with extreme values for minutes, data, SMS
  // - Test with invalid input (e.g., negative values)
});
