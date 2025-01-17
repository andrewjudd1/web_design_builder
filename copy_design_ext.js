
import utils from "./utils/index.js"
const args = process.argv
import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
const overwrite_folder = async () => {
    try {
        const design_folder = args[2]
        const dest_folder = args[3]
        console.log(design_folder, dest_folder)
        await fs.mkdir(`/Users/andrewjudd/projects/${dest_folder}/`).catch(err => err)
        exec(`cp -r /Users/andrewjudd/projects/web_design_builder/designs/${design_folder}/* /Users/andrewjudd/projects/${dest_folder}/`);
    } catch (error) {
        console.log(error)
    }
}

overwrite_folder()