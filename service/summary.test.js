// c:\Users\Mezeruy\Desktop\CapStone-GenAI\service\summary.test.js
import { generateSummary } from './summary.js';
import dotenv from 'dotenv';

dotenv.config();

describe('generateSummary', () => {
  it('should generate a personalized billing summary', async () => {
    const customer = {
      plan: 'Premium',
      minutes: 250,
      dataUsage: 8,
      smsCount: 120,
      predictedBill: 45.67, // Example predicted bill
      totalBill: 40.23,
    };

    const summary = await generateSummary(customer, process.env.API_KEY);

    // Assertions to check the content of the summary
    expect(summary).toContain('Yesh Inc'); // Check if company name is included
    expect(summary).toContain('Premium'); // Check if the plan is mentioned
    expect(summary).toContain('250'); // Check for minutes used
    expect(summary).toContain('8 GB'); // Check for data usage
    expect(summary).toContain('120'); // Check for SMS count
    expect(summary).toContain('40.23'); // Check for total bill
    expect(summary).toContain('45.67'); // Check for predicted bill
    // Add more assertions based on the expected content of your summary
  }, 10000); // Increased timeout for network requests
});

