// notification.test.js
import { checkForOutagesAndNotify } from './notification.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import DDG, { SafeSearchType } from 'duck-duck-scrape';
import twilio from 'twilio';

dotenv.config();

jest.mock('twilio', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        messages: {
            create: jest.fn(() => Promise.resolve({ sid: 'mocked-message-sid' })),
        },
    })),
}));

jest.mock('duck-duck-scrape', () => ({
    __esModule: true,
    default: {
        search: jest.fn(async () => ({
            results: [
                { description: 'This is a test result about a network outage.' },
                // Add more mock results if needed
            ],
        })),
    },
}));

jest.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: jest.fn(() => ({
        getGenerativeModel: jest.fn(() => ({
            startChat: jest.fn(() => ({
                sendMessage: jest.fn(async () => ({
                    response: {
                        functionCalls: [
                            {
                                name: 'searchEngine',
                                args: { searchInput: 'Is there any network outage in Test Region today?' },
                            },
                        ],
                    },
                })),
            })),
        })),
    })),
}));

describe('Notification Service', () => {
    it('should detect an outage, send an SMS, and return a success message', async () => {
        const result = await checkForOutagesAndNotify('Test Region', '+15555551212'); // Replace with a mock phone number
        expect(result).toBe('Outage detected and SMS sent.');
        expect(twilioClient.messages.create).toHaveBeenCalledWith({
            body: expect.stringContaining('Dear Customer, there is a network outage in your region (Test Region).'),
            from: process.env.TWILIO_PHONE_NUMBER,
            to: '+15555551212', // Verify the correct phone number is used
        });
    });

    it('should handle cases where no outage is detected', async () => {
        // Mock the search results to not include the word "outage"
        DDG.search.mockResolvedValueOnce({
            results: [
                { description: 'This is a test result with no outage information.' },
            ],
        });

        const result = await checkForOutagesAndNotify('Test Region', '+15555551212');
        expect(result).toBe('No outage detected.');
        expect(twilioClient.messages.create).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
        // Simulate an error by throwing from one of the mocked functions
        DDG.search.mockRejectedValueOnce(new Error('Simulated search error'));

        await expect(checkForOutagesAndNotify('Test Region', '+15555551212'))
            .rejects.toThrow('Failed to fetch outage data.');
        expect(twilioClient.messages.create).not.toHaveBeenCalled();
    });
});

