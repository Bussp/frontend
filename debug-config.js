// Script para debugar o app.config.js
const config = require('./app.config.js');

console.log('=== EXPO CONFIG DEBUG ===');
console.log('Google Maps API Key:', config.expo.android.config.googleMaps.apiKey);
console.log('EXPO_PUBLIC_GOOGLE_MAPS_API_KEY env:', process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY);
console.log('========================');
