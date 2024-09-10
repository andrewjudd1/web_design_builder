import fs from 'fs/promises'

function template_utils() {
    async function get_template(design_name = 'sky') {
        if (!design_name) {
            throw new Error('Design not found.')
        }
        const template_file = await fs.readFile(`templates/${design_name.replace('.json', '')}.json`)
        const template = JSON.parse(template_file)
        return template
    }
    return { get_template }
}

const template_util = template_utils()
export default template_util