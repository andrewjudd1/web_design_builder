
import utils from "./utils/index.js"
const args = process.argv
import fs from 'fs/promises'
import path from 'path'
const is_file = (file = 'index.js') => {
    return args[1].includes('index.js')
}
const design_builder = () => {

    // npm run create:design sky
    const create_design = async function () {
        const template_name = args[2]
        const template = await utils.template.get_template(template_name)
        const id = utils.helper.get_uuid()
        const name = args?.[3] ? `${template_name}_${args?.[3]}` : `${template_name}_${utils.helper.get_shorter(id)}`
        const data = {}
        data.business = args?.[3] ? await utils.data.get_data(name) : {}

        console.log(name)
        const dir = `designs/${name}`
        await fs.mkdir(dir).catch(err => null)
        await Promise.all(template.pages.map(async page => {
            let page_html = await utils.template.create_page(page)
            const replace_obj_fields = (start_key, obj) => {
                Object.entries(obj).forEach(([key, value]) => {
                    let replace_field = `${start_key}.${key}`
                    if (typeof value === 'object') {
                        if (Array.isArray(value)) {
                            value = value.join(', ')
                        }
                        replace_obj_fields(replace_field, value)
                    } else {
                        page_html = page_html.replaceAll(replace_field, value)
                    }
                })
            }
            replace_obj_fields('data', data)
            const ext = path.extname(page?.file_name)
            const file_dir = path.basename(page?.file_name).replace(ext, '')
            console.log(file_dir)
            if (file_dir === 'index') {
                await fs.writeFile(`${dir}/${file_dir}${ext}`, page_html)
            } else {
                await fs.mkdir(`${dir}/${file_dir}`).catch(err => err)
                await fs.writeFile(`${dir}/${file_dir}/index${ext}`, page_html)
            }
        }))

    }
    return { create_design }
}

const builder = design_builder()
if (is_file('index.js')) {
    builder.create_design()
}

export default design_builder