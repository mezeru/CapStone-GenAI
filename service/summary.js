import axios from 'axios';
import dotenv from 'dotenv';

import { GoogleGenerativeAI } from "@google/generative-ai";


dotenv.config();

export const generateSummary = async (customer, key) => {

const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
    "Create a personalized billing summary for a customer on the ${customer.plan} plan. The summary should include the following details:

Usage Overview:

Total Minutes Used: ${customer.minutes}
Total Data Used: ${customer.dataUsage} GB
Total SMS Sent: ${customer.smsCount}

Predicted bill according to usage in the next cycle : ${customer.predictedBill}

Billing Summary:

Total Bill: ${customer.totalBill}
Additionally, provide insights such as:

A comparison of current usage to average usage for similar customers on the same plan.
Any applicable discounts or promotions the customer might be eligible for in the next billing cycle.
Suggestions for optimizing their plan based on usage patterns (e.g., upgrading or downgrading options).
The summary should be concise yet informative, with a friendly and professional tone.
Company's name is Yesh Inc
"

  `;

  const result = await model.generateContent(prompt);

  return result.response.text();
};

