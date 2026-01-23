/**
 * Test script to verify Meteoblue API key
 * Run with: node test-meteoblue-api.js
 */

const API_KEY = 'xEeouDJW08hQfb41'; // Replace with your actual API key
const BASE_URL = 'https://my.meteoblue.com/packages/basic-1h_basic-day';

// Test location: New York City
const TEST_LAT = 40.7128;
const TEST_LON = -74.0060;

async function testMeteoblueAPI() {
  console.log('🧪 Testing Meteoblue API...\n');
  console.log('Configuration:');
  console.log('  Base URL:', BASE_URL);
  console.log('  API Key:', API_KEY.substring(0, 4) + '***');
  console.log('  Test Location: New York City');
  console.log('  Latitude:', TEST_LAT);
  console.log('  Longitude:', TEST_LON);
  console.log('');

  const url = `${BASE_URL}?lat=${TEST_LAT}&lon=${TEST_LON}&apikey=${API_KEY}`;
  console.log('Full URL (with hidden key):', url.replace(/apikey=[^&]+/, 'apikey=***'));
  console.log('');

  try {
    console.log('🚀 Making API request...\n');

    const response = await fetch(url);

    console.log('Response Status:', response.status, response.statusText);
    console.log('');

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('❌ API Request Failed!');
      console.error('Status:', response.status);
      console.error('Status Text:', response.statusText);
      console.error('Error Body:', errorBody);
      console.error('');
      console.error('Common Causes:');
      console.error('  1. Invalid or expired API key');
      console.error('  2. API key doesn\'t have access to this package (basic-1h_basic-day)');
      console.error('  3. Incorrect endpoint URL for your subscription plan');
      console.error('  4. API rate limit exceeded');
      console.error('');
      console.error('📝 How to fix:');
      console.error('  1. Get a valid API key from: https://www.meteoblue.com/en/weather-api');
      console.error('  2. Check your Meteoblue subscription plan and available packages');
      console.error('  3. Verify the API key in your .env file');
      console.error('  4. Update .env file: METEOBLUE_API_KEY=your_valid_key_here');
      console.error('  5. Restart Metro bundler: npm start -- --reset-cache');
      return;
    }

    const data = await response.json();
    console.log('✅ API Request Successful!');
    console.log('');
    console.log('Response Data Structure:');
    console.log('  Keys:', Object.keys(data).join(', '));

    if (data.data_day && data.data_day.time) {
      console.log('  Days of forecast:', data.data_day.time.length);
      console.log('  First day:', data.data_day.time[0]);
    }

    console.log('');
    console.log('🎉 Your Meteoblue API key is valid and working!');
  } catch (error) {
    console.error('❌ Unexpected Error:', error.message);
    console.error('');
    console.error('This might be a network error or connection issue.');
  }
}

// Run the test
testMeteoblueAPI();
