
import utils from "./utils/index.js"
const args = process.argv
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const overwrite_folder = async () => {
    const design_folder = args[2]
    const business = args[3]
    const design = design_folder.split(['_'])[0]
    console.log(design_folder, design, business)
    const root_dir = `${__dirname}`
    const source_dir = `${root_dir}/designs/${design_folder}`
    const new_dir = `${root_dir}/designs/${design}_${business}`
    try {
        await fs.copy(`${root_dir}/data/${design_folder}.js`, `${root_dir}/data/${design}_${business}.js`)
        await fs.copy(source_dir, new_dir, { overwrite: true })
    } catch (error) {
        console.log(error)
    }
}

overwrite_folder()