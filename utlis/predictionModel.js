// Install TensorFlow.js before running: npm install @tensorflow/tfjs
import * as tf from '@tensorflow/tfjs';
import fs from 'fs';

// Helper to one-hot encode plan categories
function oneHotEncodePlans(plans) {
  const uniquePlans = Array.from(new Set(plans));
  const planMap = {};
  uniquePlans.forEach((plan, index) => planMap[plan] = index);

  // Create a one-hot encoded array for each plan
  const oneHotEncoded = plans.map(plan => {
    const oneHot = new Array(uniquePlans.length).fill(0);
    oneHot[planMap[plan]] = 1;
    return oneHot;
  });

  return { planMap, oneHot: oneHotEncoded };
}

// Function to normalize data
function normalizeData(data) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  return data.map(value => (value - min) / (max - min));
}

// 1. Load and Process the Dataset
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
  const { oneHot: encodedPlans } = oneHotEncodePlans(plans);
  
  // Merge the encoded plan with X
  for (let i = 0; i < X.length; i++) {
    X[i] = X[i].concat(encodedPlans[i]);
  }

  // Normalize features (minutes, data, SMS)
  X.forEach((row, i) => {
    row[0] = normalizeData(X.map(r => r[0]))[i]; // Normalize MinutesUsed
    row[1] = normalizeData(X.map(r => r[1]))[i]; // Normalize DataUsedGB
    row[2] = normalizeData(X.map(r => r[2]))[i]; // Normalize SMSCount
  });

  return { X: tf.tensor2d(X), y: tf.tensor2d(y, [y.length, 1]) };
}

const { X, y } = loadData('c:/Users/Mezeruy/Desktop/Capstone GenAI/utlis/data.csv');

// 2. Create and Compile the Model
function createModel() {
  const model = tf.sequential();

  // Add layers
  model.add(tf.layers.dense({ inputShape: [6], units: 64, activation: 'relu' }));  // Input: [minutes, data, sms, plan]
  model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));  // Output: bill amount

  // Compile the model with a specified learning rate
  model.compile({
    optimizer: tf.train.adam(0.00001), // Specify a learning rate
    loss: 'meanSquaredError',  // Loss function for regression
    metrics: ['mse'],          // Mean squared error for evaluation
  });

  return model;
}

const model = createModel();

// 3. Train the Model
async function trainModel(model, X, y) {
  const batchSize = 100;
  const epochs = 1000;  // Increase epochs for better training

  const info = await model.fit(X, y, {
    batchSize,
    epochs,
    shuffle: true,
    validationSplit: 0.1, 
  });
  
}

trainModel(model, X, y).then(() => {
  console.log('Model training finished.');
});

// 4. Evaluate the Model (Assuming you have a separate test dataset)
async function evaluateModel(model, X_test, y_test) {
  const result = await model.evaluate(X_test, y_test);
}

// Example: Load test data (if available)
// const { X_test, y_test } = loadData('path/to/your/test_dataset.csv');
// evaluateModel(model, X_test, y_test);

// 5. Make Predictions
async function predict(model, newInput) {
  const prediction = model.predict(tf.tensor2d([newInput], [1, 6]));  // [Minutes, Data, SMS, Plan]
  const predictedValue = (await prediction.data())[0]; 
  return predictedValue;
}

// Example: Predict next bill for 700 minutes, 1.3GB data, 30 SMS, plan encoded as 0 (adjust plan encoding based on your data)
// Example: Predict for 700 minutes, 1.3GB data, 30 SMS, and 'premium' plan
const planEncoding = [0, 1, 0]; // Example one-hot encoding for 'premium'
const newInput = [700, 1.3, 30, ...planEncoding]; // Combine features and plan encoding
predict(model, newInput); 

async function initializeModel() {
    const { X, y } = await loadData('c:/Users/Mezeruy/Desktop/Capstone GenAI/utlis/data.csv');
    const model = createModel();
    await trainModel(model, X, y);
    return model;
  }

  export { initializeModel, predict };
