const args = process.argv
import s3_utils from "../utils/s3_utils.js"
import path from 'path'
import fs from 'fs-extra'
async function upload_file() {

    const args = process.argv

    try {
        const file_path = args[2]
        const file_name = path.basename(file_path)
        const url = await s3_utils.upload_buffer({ img: await fs.readFile(file_path), name: file_name, folder: args?.[3] || 'website' })


        console.log(file_name, url)
    } catch (error) {
        console.log(error)
    }

}

upload_file()