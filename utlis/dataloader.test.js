import fs from 'fs';
import { generateRandomData } from './dataloader.js';

describe('generateRandomData', () => {
  it('should generate an array of customer data with correct properties', () => {
    const customers = generateRandomData();
    expect(Array.isArray(customers)).toBe(true);
    expect(customers.length).toBe(100); 

    customers.forEach(customer => {
      expect(customer).toHaveProperty('CustomerID');
      expect(customer).toHaveProperty('MinutesUsed');
      expect(customer).toHaveProperty('DataUsedGB');
      expect(customer).toHaveProperty('SMSCount');
      expect(customer).toHaveProperty('Plan');
      expect(customer).toHaveProperty('BillAmount');
    });
  });

  it('should generate data within expected ranges', () => {
    const customers = generateRandomData();
    customers.forEach(customer => {
      expect(customer.MinutesUsed).toBeGreaterThanOrEqual(0);
      expect(customer.MinutesUsed).toBeLessThan(600);

      expect(parseFloat(customer.DataUsedGB)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(customer.DataUsedGB)).toBeLessThan(50);

      expect(customer.SMSCount).toBeGreaterThanOrEqual(0);
      expect(customer.SMSCount).toBeLessThan(200);
    });
  });

  it('should generate data with valid plan types', () => {
    const validPlans = ['basic', 'premium', 'business'];
    const customers = generateRandomData();
    customers.forEach(customer => {
      expect(validPlans).toContain(customer.Plan);
    });
  });

  // This test might be flaky due to randomness. Consider mocking Math.random for more deterministic tests.
  it('should write data to a CSV file', () => {
    const filename = 'data.csv'; 
    // Delete the file if it exists to ensure a clean test
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
    }

    generateRandomData(); 
    expect(fs.existsSync(filename)).toBe(true); 

    // Clean up the test file
    fs.unlinkSync(filename);
  });
});
