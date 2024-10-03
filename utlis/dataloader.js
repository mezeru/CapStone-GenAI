import fs from 'fs';
import calculateBill from './calculateBill.js';


const generateRandomData = () => {
  const plans = ['basic', 'premium', 'business'];
  const customers = [];

  for (let i = 1; i <= 100; i++) {
    const minutesUsed = Math.floor(Math.random() * 600);
    const dataUsedGB = Math.random() * 50;
    const smsCount = Math.floor(Math.random() * 200);
    const plan = plans[Math.floor(Math.random() * plans.length)];

    const billAmount = calculateBill(minutesUsed, dataUsedGB, smsCount, plan);

    customers.push({
      CustomerID: i,
      MinutesUsed: minutesUsed,
      DataUsedGB: dataUsedGB.toFixed(2),
      SMSCount: smsCount,
      Plan: plan,
      BillAmount: billAmount.toFixed(2)
    });
  }

  return customers;
};

const customers = generateRandomData();
fs.writeFileSync('data.csv', 'CustomerID,MinutesUsed,DataUsedGB,SMSCount,Plan,BillAmount\n');
customers.forEach(customer => {
  const row = `${customer.CustomerID},${customer.MinutesUsed},${customer.DataUsedGB},${customer.SMSCount},${customer.Plan},${customer.BillAmount}\n`;
  fs.appendFileSync('data.csv', row);
});