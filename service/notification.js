// notificationService.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import DDG, { SafeSearchType } from 'duck-duck-scrape';
import twilio from 'twilio';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Define the search engine function declaration
const searchEngineFunctionDeclaration = {
    name: "searchEngine",
    parameters: {
        type: "OBJECT",
        description: "Provide the user prompt",
        properties: {
            searchInput: {
                type: "STRING",
                description: "Provide the detailed input to the search engine",
            }
        },
        required: ["searchInput"],
    },
};

// Define the search function using DuckDuckGo
const functions = {
    searchEngine: async (searchQuery) => {
        const options = {
            safeSearch: SafeSearchType.STRICT
        };
        const searchResults = await DDG.search(searchQuery.searchInput, options);
        let obj = {
            searchResult: searchResults.results.map(e => e.description).join('\n')
        };
        return obj;
    }
};

// Function to send SMS notifications
const sendSMSNotification = (customerPhoneNumber, message) => {
    return twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: customerPhoneNumber
    })
    .then(message => {
        console.log(`Notification sent: ${message.sid}`);
        return message;
    })
    .catch(error => {
        console.error('Error sending SMS:', error);
        throw error;
    });
};

// Function to get real-time network outage details and send notifications
const checkForOutagesAndNotify = async (region, customerPhoneNumber) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: "You are an accurate search engine and provide meaningful results to the user in brief.",
        tools: {
            functionDeclarations: [searchEngineFunctionDeclaration],
        }
    });

    const chat = model.startChat();
    const prompt = `Is there any network outage in ${region} region today?`;
    const result = await chat.sendMessage(prompt);

    const call = await result.response.functionCalls()[0];
    if (call) {
        const apiResponse = await functions[call.name](call.args);
        
        const outageDetected = apiResponse.searchResult.includes("outage");

        if (outageDetected) {
            const outageDetails = apiResponse.searchResult;
            const smsMessage = `Dear Customer, there is a network outage in your region (${region}). Details: ${outageDetails}`;
            await sendSMSNotification(customerPhoneNumber, smsMessage);
            console.log(smsMessage);
            return "Outage detected and SMS sent.";
        } else {
            return "No outage detected.";
        }
    } else {
        throw new Error("Failed to fetch outage data.");
    }
};

export {
    checkForOutagesAndNotify
};
