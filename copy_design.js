
import utils from "./utils/index.js"
const args = process.argv
import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
const overwrite_folder = async () => {
    const design_folder = args[2]
    const dest_folder = args[3]
    exec(`cp -r /Users/andrewjudd/projects/web_design_builder/designs/${design_folder}/* /Users/andrewjudd/projects/${dest_folder}/`)

}

overwrite_folder()