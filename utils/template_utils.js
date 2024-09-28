import fs from 'fs/promises'
import path from 'path'
import { JSDOM } from 'jsdom'
import helper from './helpers.js'
function get_template_utils() {
    let cached_pieces
    let cached_css
    let cached_used_css = {}
    async function get_pieces(cached_pieces) {
        if (cached_pieces) {
            return cached_pieces
        } else {
            cached_pieces = {}
        }

        async function add_piece(full_path, file_name) {
            const file = await fs.readFile(full_path, { encoding: 'utf-8' })
            const dom = new JSDOM(file)
            cached_pieces[path.parse(file_name).name.trim()] = dom
        }
        async function add_pieces(path) {
            const pieces = await fs.readdir(path)
            for (const piece of pieces) {
                const new_path = `${path}/${piece}`
                if (await helper.is_directory(new_path)) {
                    await add_pieces(new_path)
                } else {
                    await add_piece(new_path, piece)
                }
            }
        }
        await add_pieces('pieces')

        return cached_pieces
    }
    async function get_css(cached_css) {
        if (cached_css) {
            return cached_css
        } else {
            cached_css = ''
        }
        const csss = await fs.readdir('css')
        for (const css of csss) {
            const file = await fs.readFile(`css/${css}`, { encoding: 'utf-8' })
            cached_css += file
        }
        return parse_css(cached_css)
    }
    async function toptal_compress_css(css) {
        const response = await fetch('https://www.toptal.com/developers/cssminifier/api/raw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'input': css
            })
        })
        const data = await response.text()
            .catch(error => console.error('Error:', error));
        return data
    }
    function compress_css(cssText) {
        return cssText
            .replace(/\s+/g, ' ')                   // Replace multiple spaces with a single space
            .replace(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, '')  // Remove comments
            .replace(/\s*{\s*/g, '{')               // Remove spaces around opening braces
            .replace(/\s*}\s*/g, '}')               // Remove spaces around closing braces
            .replace(/\s*:\s*/g, ':')               // Remove spaces around colons
            .replace(/\s*;\s*/g, ';')               // Remove spaces around semicolons
            .replace(/;}/g, '}')                    // Remove semicolons before closing braces
            .replace(/\s*,\s*/g, ',')               // Remove spaces around commas
            .replace(/\s*!\s*/g, '!')               // Remove spaces around !important
            .replace(/:\s*0(px|%|em|rem)?/g, ':0')  // Remove units for zero values (e.g., 0px -> 0)
            .replace(/([0-9]+)ms/g, (match, p1) => (p1 / 1000).toString().replace(/^0+/, '') + 's') // Convert ms to s when appropriate

            .trim();                       // Remove last semicolon before closing brace
    }

    function parse_css(css_text, last_css_obj = {}) {
        const blocks = css_text.match(/([^{]+)\{([^}]+)\}/g); // Match each CSS block
        const css = {}
        blocks.forEach(block => {
            const [selector, properties] = block.split(/\s*\{\s*/); // Split by selector and properties
            const props_array = properties.replace('}', '').trim().split(';'); // Get individual properties
            const prop_obj = {};

            props_array.forEach(property => {
                const [key, value] = property.split(':').map(p => p.trim()); // Split by key and value
                if (key && value) {
                    prop_obj[key] = value;
                }
            });

            css[selector?.trim()] = prop_obj

        });

        return { ...last_css_obj, ...css };
    }
    function deparse_css(css_obj) {
        let css_text = ''
        const render_prop = (value) => {
            return Object.entries(value).map(([key, value]) => {
                return `${key}: ${value};`
            }).join('\n')
        }
        Object.entries(css_obj || {}).forEach(([key, value]) => {
            css_text += `${key} {\n${render_prop(value)}\n}\n\n`
        })
        return css_text?.toString()?.trim() || ''
    }
    function render_element(el) {
        if (el?.class) {
            const classes = el?.class?.split(' ')
            classes.forEach((css_class) => {
                const cached_css_finds = Object.keys(cached_css).filter(key => key.includes(css_class))
                cached_css_finds.forEach(found_class => {
                    cached_used_css[found_class] = cached_css?.[found_class]
                })
            })
        }
        if (el?.text) {
            return el?.text
        } else if (el?.elements?.length) {
            return render_elements(el.elements)?.final_html
        } else {
            return ''
        }
    }
    function render_piece(el, dom, props) {
        let html = dom.window.document.querySelector('body').innerHTML
        const css = dom.window.document.querySelector('style').textContent
        const obj_css = parse_css(css)
        const filter_properties = ['tag', 'elements', 'text']
        cached_used_css = { ...cached_used_css, ...obj_css }

        props.filter(prop => !filter_properties.includes(prop)).forEach(prop => {
            html = html.replaceAll(`{{${prop}}}=""`, `${prop}="${el?.[prop] || ''}"`)
        })

        return html.replace(`{{children}}`, render_element(el))
    }

    function render_elements(els, pieces, css) {
        if (pieces) {
            cached_pieces = pieces
        }
        if (css) {
            cached_css = css
        }

        if (!els?.length) {
            return
        }

        const final_html = els?.map(el => {
            if (!el) {
                return ''
            }
            const filter_properties = ['tag', 'elements', 'text']
            const props = Object.keys(el).filter(key => !filter_properties.includes(key))
            const prop_str = props.map(key => `${key}="${el?.[key] || ''}"`).join(' ')
            const tag = el?.tag

            return cached_pieces?.[tag] ? render_piece(el, cached_pieces?.[tag], props) : `
<${el?.tag} ${prop_str} >
        ${render_element(el, css)}
</${el?.tag}>`
        }
        )?.join('')

        console.log('cach', cached_used_css)

        return { final_html, final_css: deparse_css(cached_used_css) }


    }
    return { render_element, render_elements, get_pieces, toptal_compress_css, get_css, deparse_css }
}

const template_utils = get_template_utils()
export default template_utils