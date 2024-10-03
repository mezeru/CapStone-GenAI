// tests/billing.test.js
const { calculateBill } = require('../services/billing');

test('calculates correct bill for basic plan', () => {
  const bill = calculateBill(100, 5, 20, 'basic');
  expect(bill).toBeCloseTo(15.7);
});

test('calculates correct bill for premium plan', () => {
  const bill = calculateBill(200, 10, 50, 'premium');
  expect(bill).toBeCloseTo(23.5);
});

test('calculates correct bill for business plan', () => {
  const bill = calculateBill(300, 20, 100, 'business');
  expect(bill).toBeCloseTo(32.6);
});
