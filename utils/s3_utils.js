import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import mime from 'mime-types'
import sharp from 'sharp';
import helper from './helpers.js';
dotenv.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const s3_client = new S3Client({ region: 'us-east-1', credentials: { accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_KEY } });

async function upload_buffer(options) {
    const bucket = options?.bucket || 'airbucket-01';
    const img = options.img;
    const image_name = options?.name;
    const contentType = mime.lookup(image_name) || 'application/octet-stream';

    await s3_client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: `${options?.folder ? `${options?.folder}/${image_name}` : image_name}`,
        Body: img,
        ContentType: contentType
    }));

    const url = `https://${bucket}.s3.us-east-1.amazonaws.com${options?.folder ? `/${options?.folder}` : ''}/${image_name}`;
    return {
        ...options, image_name, url: url,
    };
}

async function format(options) {
    if (options.format === 'jpg') {
        options.format = 'jpeg'
    }
    const buffer = options?.file_path ? await fs.readFile(options?.file_path) : Buffer.from(await utils.fetch(options?.image_url, { response_type: 'buffer' }))
    //heic, heif, avif, jpeg, jpg, jpe, tile, dz, png, raw, tiff, tif, webp, gif, jp2, jpx, j2k, j2c, jxl
    const file_name = `${options?.file_name?.split('.')?.[0] || 'file'}_${helper.compressed_uuid()}.${options?.format}`
    let file
    let img = {}
    if (options?.format?.includes('svg')) {
        // potrace.posterize(options?.image_url, { background: '#49ffd2', color: 'blue', threshold: 180, steps: 4 }, async (err, svg) => {
        //     if (err) throw err
        //     await fs.writeFile(path.join(__dirname, '../uploads', file_name), svg)
        // })
        const svg = await bitmap2vector({
            input: buffer,
            // colorquantcycles: 100,
            // linefilter: true,
            // mincolorratio: 4000,
            // numberofcolors: 2000
        })
        const svgo = optimize(svg.content)
        await fs.writeFile(path.join(__dirname, '../uploads', file_name), svgo.data)
    } else {
        let quality = 100
        img.data = buffer
        const resize_obj = {}
        const resize_image = async () => {
            img = await sharp(img?.data)[options?.format]({ quality }).rotate().resize({
                ...(options?.resize || {}),
                fit: sharp.fit.cover,
                position: sharp.strategy.attention
            }).toBuffer({ resolveWithObject: true, })
            if ((options.compress_to && img.info.size >= Number(options?.compress_to)) && quality > 60) {
                quality -= 10
                return await resize_image()
            }
            return img
        }
        const round_image = async () => {
            if (options.round_image) {
                const rect = Buffer.from(
                    `<svg><rect x="0" y="0" width="${options?.resize?.width || 50}" height="${options?.resize?.height || 50}" rx="50" ry="50"/></svg>`
                );
                img = await sharp(img?.data).composite([{ input: rect, blend: 'dest-in' }]).toBuffer({ resolveWithObject: true, })
            }
            return img
        }
        const overlay_img = async () => {
            if (options.overlay_url) {
                const overlay_buffer = Buffer.from(await utils.fetch(options?.overlay_url, { response_type: 'buffer' }))
                img = await sharp(img?.data).composite([{ input: overlay_buffer }]).toBuffer({ resolveWithObject: true, })
            }
            return img
        }
        img = await resize_image()
        img = await round_image()
        img = await overlay_img()
        file = await fs.writeFile(path.join(__dirname, '../uploads', file_name), img.data)
    }

    let url = ''
    if (options?.upload_to === 'aws') {
        url = await upload_buffer({ img: img.data, name: file_name, folder: options?.folder || 'website' })
    }
    return { file_name, url }
}

const s3_utils = { upload_buffer, format }
export default s3_utils