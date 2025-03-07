
import utils from "./utils/index.js"
const args = process.argv
import fs from 'fs-extra'
import fsp from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const overwrite_folder = async () => {
    const design_folder = args[2]
    const old_business = args?.[2]?.split('_')?.[1] || ''
    const business = args?.[3]
    const design = design_folder.split(['_'])[0]
    console.log(design_folder, design, business)
    const root_dir = `${__dirname}`
    const source_dir = `${root_dir}/designs/${design_folder}`
    const new_dir = `${root_dir}/designs/${design}_${business}`

    try {
        await fs.copy(`${root_dir}/data/${design_folder}.js`, `${root_dir}/data/${design}_${business}.js`)
        await fs.copy(`${root_dir}/templates/${design_folder}.js`, `${root_dir}/templates/${design}_${business}.js`)
        await fs.copy(`${root_dir}/css/${design_folder}.css`, `${root_dir}/css/${design}_${business}.css`)
        const template_file = await fsp.readFile(`${root_dir}/templates/${design}_${old_business}.js`, { encoding: 'utf-8' })
        const new_template = template_file.replaceAll(design_folder, `${design}_${business}`).replaceAll(`${design}${old_business}`, `${design}${business}`)
        await fs.writeFile(`${root_dir}/templates/${design}_${business}.js`, new_template)
        const pages_dir = `${root_dir}/pieces/pages`
        const pages = await fsp.readdir(pages_dir)
        const bus_pages = pages.filter(page => page.includes(`${design}${old_business}`))
        await Promise.all(bus_pages.map(async page => {
            console.log(page)
            await fs.copy(`${pages_dir}/${page}`, `${pages_dir}/${page.replaceAll(`${`${design}${old_business}`}`, `${design}${business}`)}`)
        }))
        const add_index = async (sub_dir) => {
            const files = (await fsp.readdir(path.join(__dirname, sub_dir))).filter(item => !item.includes('index'));
            console.log(files);
            let index_file = ``;
            for (const file of files) {
                let name = file.split('.')[0];
                index_file += `import ${name} from './${file}' \n`;
            }
            index_file += `export default {`;
            for (const file of files) {
                let name = file.split('.')[0];
                index_file += `${name}, `;
            }
            index_file += `}`;
            await fs.writeFile(`${path.join(__dirname, sub_dir)}/index.js`, `${index_file}`);
        }
        await add_index('/data')
        await add_index('/templates')
        await fs.copy(source_dir, new_dir, { overwrite: true })
    } catch (error) {
        console.log(error)
    }
}

overwrite_folder()