import { predict } from "../utlis/predictionModel.js"; // Make sure this path is correct


export const predictionSerice = async (minutesUsed, dataUsedGB, smsCount, plan, model) => {

    const plans = ['basic', 'premium', 'business'];
    const planIndex = plans.indexOf(plan.toLowerCase());
  
    if (planIndex === -1) {
      return res.status(400).json({ error: 'Invalid plan' });
    }
  
    // One-hot encode the plan
    const planEncoding = [0, 0, 0]; 
    planEncoding[planIndex] = 1; 
  
    try {
      // Pass the one-hot encoded plan to the prediction function
      const predictedBill = await predict(model, [minutesUsed, dataUsedGB, smsCount, ...planEncoding]); 
      
      return predictedBill;

    } catch (error) {
      console.error('Error during prediction:', error);
    }

};