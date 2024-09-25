import fs from 'fs/promises'

function get_data_util() {
    async function get_data(company_name = '') {
        if (!company_name) {
            throw new Error('Design not found.')
        }
        const file = await fs.readFile(`data/${company_name.replace('.json', '')}.json`).catch(err => err)
        const json = JSON.parse(file)
        return json
    }
    return { get_data }
}

const data_util = get_data_util()
export default data_util