import s3_utils from "../utils/s3_utils.js";
import path from 'path'
const args = process.argv

async function format_file() {
    try {


        const file_path = args[2]
        const file_name = path.basename(file_path)
        const file = await s3_utils.format({
            file_name,
            format: 'jpg',
            file_path,
            upload_to: args[3] || '',
            compress_to: args[4] || '500000',
        })
        console.log(file)

    } catch (error) {
        console.log(error)
    }

}

format_file()