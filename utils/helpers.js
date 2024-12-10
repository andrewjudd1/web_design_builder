import crypto from 'crypto'
import fs from 'fs/promises'
const helpers = () => {
    const get_uuid = () => {
        return crypto.randomUUID()
    }

    const is_directory = async (path) => {
        const stat = await fs.stat(path)
        return stat.isDirectory()
    }

    const get_shorter = (item) => {
        function base62Encode(num) {
            const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let encoded = '';
            while (num > 0) {
                encoded = chars[num % 62] + encoded;
                num = Math.floor(num / 62);
            }
            return encoded;
        }

        function compress(item) {
            const hash = crypto.createHash('sha256').update(item).digest('hex');
            const num = parseInt(hash.slice(0, 8), 16);
            return base62Encode(num);
        }
        return compress(item)
    }

    function compressed_uuid() {
        function base62Encode(num) {
            const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let encoded = '';
            while (num > 0) {
                encoded = chars[num % 62] + encoded;
                num = Math.floor(num / 62);
            }
            return encoded;
        }

        function compressURL(url) {
            // Generate a hash of the URL
            const hash = crypto.createHash('sha256').update(url).digest('hex');
            // Convert the hash to a number
            const num = parseInt(hash.slice(0, 8), 16); // Use only the first 8 characters of the hash
            // Encode the number in base62
            return base62Encode(num);
        }
        return compressURL(get_uuid())
    }

    const html_template = ``

    return { get_uuid, compressed_uuid, get_shorter, is_directory }
}

const helper = helpers()
export default helper