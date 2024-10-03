# AI-Powered Telecom Billing System

## Overview

This project implements an **AI-driven Telecom Billing System** that performs the following tasks:
- **Calculates customer bills** based on their plan and usage.
- **Predicts future bills** using a machine learning model based on past usage.
- **Generates personalized billing summaries** using the Gemini API.
- **Sends real-time network outage notifications** using Twilio.
- **Conducts testing and optimization** of the system to ensure it is bug-free and optimized.

### Key Features
1. Billing calculation based on subscription plans and usage.
2. Predictive analysis using TensorFlow.js for forecasting future bills.
3. Content generation with personalized summaries via Gemini API.
4. Real-time outage notifications using Twilio SMS service.
5. Comprehensive unit and integration testing, as well as bug detection.

### Packages and Dependencies

1. **@google/generative-ai (v0.20.0)**  
   - Used for integrating with the Gemini API to generate personalized billing summaries using AI.

2. **@tensorflow/tfjs (v4.21.0)**  
   - A JavaScript library for building and training machine learning models directly in Node.js, used for predictive analysis and forecasting bills based on customer usage.

3. **csv-parser (v3.0.0)**  
   - A lightweight CSV file parser for reading and preprocessing customer usage data from CSV files.

4. **dotenv (v16.4.5)**  
   - Loads environment variables from a `.env` file into the process, allowing for secure and configurable access to sensitive API keys, such as those for Twilio and Gemini.

5. **duck-duck-scrape (v2.2.5)**  
   - A scraping library used for extracting public customer-related information, if needed for other services such as outage detection.

6. **express (v4.21.0)**  
   - A web framework for building the REST API endpoints to interact with the billing system and other services.

7. **node-fetch (v3.3.2)**  
   - A lightweight library used for making HTTP requests (e.g., to the Gemini API) to generate summaries or fetch data.

8. **twilio (v5.3.2)**  
   - Twilio's Node.js SDK, used for sending SMS notifications to customers in case of network outages or bill generation notifications.
