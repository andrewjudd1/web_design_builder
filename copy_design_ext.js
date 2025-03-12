import fs from 'fs/promises';
import path from 'path';
import { exec as execCallback, spawn } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execCallback);

const runCommand = async (command, cwd = null) => {
    try {
        const options = cwd ? { cwd } : {};
        await exec(command, options);
        console.log(`Executed: ${command}`);
    } catch (error) {
        console.error(`Error executing command: ${command}\n${error.message}`);
        throw error;
    }
};

const overwrite_folder = async () => {
    try {
        const args = process.argv;
        const design_folder = args[2];
        const dest_folder = args[3];

        if (!design_folder || !dest_folder) {
            throw new Error("Both 'design_folder' and 'dest_folder' arguments are required.");
        }

        const [template, company] = design_folder.split('_') || ['', ''];

        console.log(`Design Folder: ${design_folder}`);
        console.log(`Destination Folder: ${dest_folder}`);
        console.log(`Template: ${template}`);
        console.log(`Company: ${company}`);

        const destPath = `/home/ubuntu/${dest_folder}/`;
        const designPath = `/home/ubuntu/web_design_builder/designs/${design_folder}`;

        // Create destination folder if it doesn't exist
        await fs.mkdir(destPath, { recursive: true });

        // Execute the index.js script with arguments
        const indexPath = path.resolve('index.js');
        const child = spawn('node', [indexPath, 'prod', template, company], {
            stdio: 'inherit',
        });

        await new Promise((resolve, reject) => {
            child.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`index.js process exited with code ${code}`));
            });
        });
        console.log('Executed index.js');

        // Copy files from design folder to destination folder
        await runCommand(`cp -r ${designPath}/* ${destPath}`);

        // // Change working directory for Git operations
        // process.chdir(destPath);

        // // Check if there are changes before committing
        // const statusOutput = await exec('git status --porcelain');
        // if (!statusOutput.stdout.trim()) {
        //     console.log('No changes to commit. Skipping Git operations.');
        //     return;
        // }

        // // Git commands for deployment
        // await runCommand('git add .');
        // await runCommand(`git commit -m "Deploy: ${new Date().toISOString()} ${args?.[4] ? args[4].split('_').join(' ') : ''}"`);
        // try {
        //     await runCommand('git push');
        //     console.log('Changes pushed successfully. Deployment triggered.');
        // } catch (error) {
        //     console.error('Error during git push:', error.message);
        //     throw error;
        // }
    } catch (error) {
        console.error('Error:', error.message);
    }
};

overwrite_folder();
