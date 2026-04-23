// Test file to verify slug generation
import { generatePropertyUrl } from './lib/propertyUrl.js';

// Test data based on your API response
const testTitle = "test topwnishop";
const testPropertyId = "RR-7573";
const testBhk = "1 BHK";
const testCity = "Gandhinagar";

// Generate slug with new format
const newSlug = generatePropertyUrl(testTitle, testPropertyId, testBhk, testCity);

console.log('Test Results:');
console.log('Title:', testTitle);
console.log('BHK:', testBhk);
console.log('City:', testCity);
console.log('Property ID:', testPropertyId);
console.log('Generated Slug:', newSlug);
console.log('Expected Format: 1-bhk-test-topwnishop-gandhinagar-RR-7573');
console.log('Match:', newSlug === '1-bhk-test-topwnishop-gandhinagar-RR-7573');

// Test without BHK and city
const oldSlug = generatePropertyUrl(testTitle, testPropertyId);
console.log('\nOld format (fallback):', oldSlug);

// Test with only BHK
const bhkOnlySlug = generatePropertyUrl(testTitle, testPropertyId, testBhk);
console.log('BHK only:', bhkOnlySlug);

// Test with only city
const cityOnlySlug = generatePropertyUrl(testTitle, testPropertyId, undefined, testCity);
console.log('City only:', cityOnlySlug);
