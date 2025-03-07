// utils/imageProcessor.js

import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv'
dotenv.config()
// Initialize S3 client
const s3 = new S3Client({ region: 'us-east-1', credentials: { accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_KEY } });

/**
 * Resizes an image to specified widths, uploads to S3, and returns HTML <img> tag with srcset.
 * @param {string} imageUrl - The URL of the source image.
 * @param {Array<number>} sizes - An array of widths to resize the image to.
 * @param {string} bucketName - The name of the S3 bucket.
 * @returns {Promise<string>} - HTML <img> tag with srcset attribute.
 */
export async function processAndUploadImage(imageUrl, sizes, bucketName = 'airbucket-01') {
    const imageName = path.basename(imageUrl, path.extname(imageUrl));
    const imageExtension = path.extname(imageUrl).slice(1); // e.g., 'jpg' or 'png'

    // Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
    }
    const imageBuffer = await response.buffer();

    // Prepare srcset and upload promises
    const srcset = [];
    const uploadPromises = sizes.map(async (width) => {
        const resizedImageBuffer = await sharp(imageBuffer)
            .resize({ width })
            .toFormat(imageExtension)
            .toBuffer();

        const s3Key = `${imageName}-${width}.${imageExtension}`;
        const uploadParams = {
            Bucket: bucketName,
            Key: s3Key,
            Body: resizedImageBuffer,
            ContentType: `image/${imageExtension}`,
        };

        await s3.send(new PutObjectCommand(uploadParams));

        const resizedImageUrl = `https://${bucketName}.s3.amazonaws.com/${s3Key}`;
        srcset.push(`${resizedImageUrl} ${width}w`);
    });

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    // Generate the HTML <img> tag with srcset
    const imgTag = `<img src="${imageUrl}" srcset="${srcset.join(', ')}" alt="${imageName}">`;
    return imgTag;
}
