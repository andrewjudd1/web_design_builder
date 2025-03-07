// scripts/processImage.js

import { processAndUploadImage } from '../utils/image_processor.js';

const args = process.argv.slice(2);

if (args.length < 2) {
    console.error('Usage: node scripts/processImage.js <imageUrl> <sizes...>');
    process.exit(1);
}

const [imageUrl, ...sizes] = args;
const numericSizes = sizes.map(Number);

(async () => {
    try {
        const htmlTag = await processAndUploadImage(imageUrl, numericSizes);
        console.log('Generated HTML:');
        console.log(htmlTag);
    } catch (error) {
        console.error('Error processing image:', error);
    }
})();
