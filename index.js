
import utils from "./utils/index.js"
const args = process.argv
import fs from 'fs/promises'
const is_file = (file = 'index.js') => {
    return args[1].includes('index.js')
}
const design_builder = () => {

    // npm run create:design sky
    const create_design = async function () {
        const template_name = args[2]
        const template = await utils.template.get_template(template_name)
        const id = utils.helper.get_uuid()
        const design_name = args?.[3] || `${template_name}_${utils.helper.get_shorter(id)}`
        console.log(design_name)
        const dir = `designs/${design_name}`
        await fs.mkdir(dir)
        await Promise.all(template.pages.map(async page => {
            await fs.writeFile(`${dir}/${page?.link_title?.toLowerCase()}`, ``)
        }))

    }
    return { create_design }
}

const builder = design_builder()
if (is_file('index.js')) {
    builder.create_design()
}

export default design_builder