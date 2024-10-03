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

initializeModel()
  .then(loadedModel => {
    model = loadedModel;
    console.log('Model initialized successfully.');
  })
  .catch(error => {
    console.error('Error initializing model:', error);
  });

app.post('/bill-Summary', async (req, res) => {

  try{
    let customer = req.body;
    const bill = calcBillSerice(customer);
    const predictedBill = await predictionSerice(customer.minutes, customer.dataUsage, customer.smsCount, customer.plan, model);
    customer.totalBill = bill;
    customer.predictedBill = predictedBill;
    const summary = await generateSummary(customer, process.env.API_KEY);
    console.log(summary);
    res.json({summary})
  }

  catch (error) {
    console.error('Error during prediction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/total-bill', async (req, res) => {

    try{
      let customer = req.body;
      const bill = calcBillSerice(customer);
      res.status(200).json({bill});

    }
    catch(e){
      console.error('Error calculating Bill:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }


})

app.post('/Outages', async (req, res) => {

  try{

    const {region,phoneNumber} = req.body;
    
    const resp = await checkForOutagesAndNotify(region, phoneNumber);
    res.status(200).json(resp)
  }
  catch(e){
    console.error('Error finding Outages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }



})

    
// Endpoint to predict the bill
app.post('/predict-bill', async (req, res) => {
    const { minutesUsed, dataUsedGB, smsCount, plan } = req.body;
  
    try{
      const predictedBill = await predictionSerice(minutesUsed, dataUsedGB, smsCount, plan, model);
      res.json({ predictedBill });
    }
    catch{
      res.status(500).json({ error: 'Internal Server Error' });
    }
    
  });
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
