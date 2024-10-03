// utils/calculateBill.js

const calculateBill = (minutes, dataUsage, smsCount, plan) => {
    let rates = { minutes: 0, dataUsage: 0, sms: 0 };
  
    switch (plan) {
      case 'basic':
        rates = { minutes: 0.10, dataUsage: 0.05, sms: 0.01 };
        break;
      case 'premium':
        rates = { minutes: 0.08, dataUsage: 0.04, sms: 0.005 };
        break;
      case 'business':
        rates = { minutes: 0.06, dataUsage: 0.03, sms: 0.002 };
        break;
      default:
        throw new Error('Invalid plan type');
    }
  
    let bill = (minutes * rates.minutes) + (dataUsage * rates.dataUsage) + (smsCount * rates.sms);
  
    // Example Overage and Discounts
    // Add overage charges if usage exceeds certain thresholds
    if (plan === 'basic' && dataUsage > 10) { // Example threshold
      bill += (dataUsage - 10) * 0.04; // Overage rate
    }
  
    // Apply discounts for long-term customers (assuming 10% discount)
    const discount = 0.10;
    bill = bill - (bill * discount);
  
    return parseFloat(bill.toFixed(2));
  };

export default calculateBill;


  