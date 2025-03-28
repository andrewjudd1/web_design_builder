
import utils from "./utils/index.js"
const args = process.argv
import fs from 'fs/promises'
import path from 'path'
import business_data from "./data/index.js"
import { exec, spawn, execSync } from 'child_process';
import open from "open"
const is_file = (file = 'index.js') => {
    return args[1].includes('index.js')
}
function isTabOpen(url) {
    try {
        const script = `
        tell application "Google Chrome"
            set windowList to every window
            repeat with w in windowList
                set tabList to every tab of w
                repeat with t in tabList
                    if (URL of t contains "${url}") then
                        tell t to reload
                        return "true"
                    end if
                end repeat
            end repeat
        end tell
        return "false"
      `;
        const result = execSync(`osascript -e '${script}'`).toString().trim();
        console.log('result', result)
        return result === "true";
    } catch (error) {
        console.log(error)
        return false;
    }
}
async function openBrowser(template, designName) {
    const url = `http://localhost:5500/designs/${template.split('_')[0]}_${template?.split('_')?.[1] || designName}/`;

    console.log(`Opening browser at ${url} ${isTabOpen(url)}`);
    if (!isTabOpen(url)) {
        await open(url, { app: { name: 'google chrome' } });
    }
}

function runServer() {
    return new Promise((resolve, reject) => {
        const serveProcess = spawn('npx', ['serve', '-p', '5500'], { stdio: 'inherit' });

        // Call resolve immediately after starting the server
        serveProcess.on('spawn', () => {
            console.log('Server started successfully on port 5500');
            resolve();
        });

        serveProcess.on('error', (err) => {
            reject(new Error(`Failed to start server: ${err.message}`));
        });

        // Optional: Log if server stops unexpectedly
        serveProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Server exited with code ${code}`);
            }
        });
    });
}


function killProcessOnPort(port, callback) {
    exec(`lsof -i :${port} -t`, (err, stdout) => {
        if (err) {
            if (err.code === 1) {
                console.log(`No process found on port ${port}`);
            } else {
                console.error(`Error checking process on port ${port}:`, err);
            }
            return callback(); // Continue even if no process was found
        }

        if (stdout) {
            const pid = stdout.trim();
            console.log(`Killing process ${pid} on port ${port}`);
            exec(`kill -9 ${pid}`, (killErr) => {
                if (killErr) {
                    console.error(`Error killing process ${pid}:`, killErr);
                } else {
                    console.log(`Process ${pid} killed successfully.`);
                }
                callback();
            });
        } else {
            console.log(`No process running on port ${port}.`);
            callback();
        }
    });
}


const design_builder = () => {


    // npm run create:design sky
    const create_design = async function () {
        const template_name = args[3].split('_')[0]
        args[4] = args?.[4] || args?.[3]?.split('_')?.[1] || ''
        console.log(template_name, args[4])
        const name = args?.[4] ? `${template_name}_${args?.[4]}` : `${template_name}_${utils.helper.get_shorter(id)}`
        const template = await utils.template.get_template(name)
        const id = utils.helper.get_uuid()
        const data = {}
        data.business = args?.[4] ? business_data?.[name]({ root_url: args?.[2] === 'dev' ? `/designs/${name}` : '' }) : {}
        console.log('data', data)
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
    console.log(process.argv);
    builder.create_design();

    // Kill any existing process on port 5500, start the server, then open Chrome
    if (args?.[2] !== 'prod') {
        killProcessOnPort(5500, () => {
            runServer()
                .then(() => {
                    // Add a short delay before opening the browser to ensure server readiness
                    setTimeout(() => {
                        openBrowser(args[3], args[4]);
                    }, 2000); // Adjust delay if necessary
                })
                .catch((error) => {
                    console.error("Error starting server:", error);
                });
        });
    }
}


export default design_builder