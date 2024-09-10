import crypto from 'crypto'
const helpers = () => {
    const get_uuid = () => {
        return crypto.randomUUID()
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

    const html_template = ``

    return { get_uuid, get_shorter }
}

const helper = helpers()
export default helper