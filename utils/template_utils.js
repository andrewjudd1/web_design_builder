import fs from 'fs/promises'
import path from 'path'
import { JSDOM } from 'jsdom'
import helper from './helpers.js'
function get_template_utils() {
    let cached_pieces
    let cached_css
    let cached_used_css = {}
    let cached_scripts = ''
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
    async function get_css(cached_css, page_css) {
        if (cached_css) {
            return cached_css
        } else {
            cached_css = ''
        }
        for (const css of page_css) {
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
            .catch(error => error);
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

    // function parse_css(css_text, last_css_obj = {}) {
    //     const blocks = css_text.match(/([^{]+)\{([^}]+)\}/g); // Match each CSS block
    //     const css = {}
    //     blocks.forEach(block => {
    //         const [selector, properties] = block.split(/\s*\{\s*/); // Split by selector and properties
    //         const props_array = properties.replace('}', '').trim().split(';'); // Get individual properties
    //         const prop_obj = {};

    //         props_array.forEach(property => {
    //             const [key, value] = property.split(':').map(p => p.trim()); // Split by key and value
    //             if (key && value) {
    //                 prop_obj[key] = value;
    //             }
    //         });

    //         css[selector?.trim()] = prop_obj

    //     });

    //     return { ...last_css_obj, ...css };
    // }

    function parse_css(css_text, last_css_obj = {}) {
        const css = { ...last_css_obj }; // Clone to avoid mutations

        const mediaQueryRegex = /@media[^{]+\{([\s\S]+?})\s*}/g; // Match media queries
        const keyframesQueryRegex = /@keyframes[^{]+\{([\s\S]+?})\s*}/g; // Match media queries

        const cssBlockRegex = /([^{]+)\{([^}]+)\}/g; // Match standard CSS blocks
        const css_imports = css_text.match(/@import\s+url\(['"]?.*?['"]?\);/g, '') || [];
        css.imports = [...css_imports, ...(css.imports || [])];
        css_text = css_text.replace(/@import\s+url\(['"]?.*?['"]?\);/g, '').trim();

        let mediaMatch;
        let regularCSS = css_text; // We'll process media queries separately
        const mediaQueries = [];
        const keyframeQueries = [];
        // Process media queries
        while ((mediaMatch = mediaQueryRegex.exec(css_text)) !== null) {
            const mediaQuery = mediaMatch[0];
            const mediaRules = mediaMatch[1];
            const mediaSelector = mediaQuery.split('{')[0].trim();
            mediaQueries.push([mediaSelector, parse_css(mediaRules)]); // Recursively parse the rules inside the media query
            regularCSS = regularCSS.replace(mediaQuery, '');
        }

        while ((mediaMatch = keyframesQueryRegex.exec(css_text)) !== null) {
            const keyframeQuery = mediaMatch[0];
            const keyframeRules = mediaMatch[1];
            const keyframeSelector = keyframeQuery.split('{')[0].trim();
            keyframeQueries.push([keyframeSelector, parse_css(keyframeRules)]); // Recursively parse the rules inside the keyframe query
            regularCSS = regularCSS.replace(keyframeQuery, '');
        }

        // Process regular CSS blocks
        const blocks = regularCSS.match(cssBlockRegex) || [];
        blocks.forEach(block => {
            const [selector, properties] = block.split(/\s*\{\s*/);
            const cleanedSelector = selector.trim();

            // Use a regex that better handles property:value pairs, including 'url(...)'
            const props_array = properties.replace('}', '').trim().match(/[^:;]+:[^;]+(?=;|$)/g) || [];
            const prop_obj = {};

            props_array.forEach(property => {
                // Split only on the first colon to capture the key-value pair, allowing URLs
                const [key, ...rest] = property.split(':');
                const value = rest.join(':').trim(); // Re-join in case of extra colons in URLs

                if (key && value) {
                    prop_obj[key.trim()] = value;
                }
            });

            // Skip media queries, since they are processed separately
            if (!cleanedSelector.startsWith('@')) {
                css[cleanedSelector] = { ...css[cleanedSelector], ...prop_obj };
            }
        });

        // Append media queries back to maintain order
        mediaQueries.forEach(([mediaSelector, mediaRules]) => {
            css[mediaSelector] = mediaRules;
        });

        // Append media queries back to maintain order
        keyframeQueries.forEach(([keyframeSelector, keyframeRules]) => {
            css[keyframeSelector] = keyframeRules;
        });

        return css;
    }




    function deparse_css(css_obj) {
        let css_text = '';

        const render_prop = (value) => {
            return Object.entries(value).map(([key, value]) => {
                // Ensure url(...) syntax is retained and formatted correctly
                const formattedValue = value.includes('url(') ? `${value};` : `${value};`;
                return `${key}: ${formattedValue}`;
            }).join('\n');
        };

        const process_css_block = (key, value) => {
            let block = '';

            if (typeof value === 'object') {
                const nestedBlocks = Object.entries(value).filter(([nestedKey]) => nestedKey.includes(' '));
                const cssProperties = Object.entries(value).filter(([nestedKey]) => !nestedKey.includes(' '));

                if (cssProperties.length > 0) {
                    block += `${key} {\n${render_prop(Object.fromEntries(cssProperties))}\n}`;
                }

                if (nestedBlocks.length > 0) {
                    nestedBlocks.forEach(([nestedKey, nestedValue]) => {
                        block += `\n${process_css_block(nestedKey, nestedValue)}`;
                    });
                }
            }

            return block;
        };

        Object.entries(css_obj || {}).forEach(([key, value]) => {
            if (key.startsWith('@')) {
                css_text += `${key} {\n`;

                Object.entries(value).forEach(([innerKey, innerValue]) => {
                    css_text += `${process_css_block(innerKey, innerValue)}\n`;
                });

                css_text += '}\n\n';
            } else {
                css_text += `${process_css_block(key, value)}\n\n`;
            }
        });

        return `${css_obj?.imports?.join('\n') || ''}\n\n${css_text?.toString()?.trim() || ''}`;
    }



    function add_css_classes(classes) {
        if (!Array.isArray(classes)) {
            return
        }
        classes.forEach((css_class) => {
            const cached_css_finds = Object.keys(cached_css).filter(key => key.includes(css_class))
            cached_css_finds.forEach(found_class => {
                cached_used_css[found_class] = cached_css?.[found_class]
            })
        })
    }


    function render_element(el) {
        if (el?.class) {
            const classes = el?.class?.split(' ')
            add_css_classes(classes)
        }
        if (el?.text) {
            return el?.text
        } else if (el?.elements?.length) {
            return render_elements(el.elements)?.final_html
        } else {
            return ''
        }
    }
    function extractAndReplaceCustomElements(htmlText, replacementHtmlFn, customElements = []) {
        // Regular expression to match a custom element (opening tag, closing tag, and everything in between)
        const customElementRegex = /<([a-z]+-[a-z0-9\-]*)\b([^>]*)>([\s\S]*?)<\/\1>/i;

        // Function to parse attributes from the attribute string
        function getAttributes(attributeString) {
            const attributes = {};
            // Match attribute name and value pairs (handles cases with or without quotes)
            const attrRegex = /([a-zA-Z-]+)(?:\s*=\s*["]([^"]*)["])?/g;
            let attrMatch;
            while ((attrMatch = attrRegex.exec(attributeString)) !== null) {
                attributes[attrMatch[1]] = attrMatch?.[2] || true; // If no value is found, it's a boolean attribute (e.g., 'disabled')
            }
            return attributes;
        }

        // Base case: if no more custom elements are found, return the modified HTML and the accumulated array
        const match = customElementRegex.exec(htmlText);
        if (!match) {
            return { modifiedHtml: htmlText, customElements };
        }



        // Create an object for the current custom element
        const elementData = {
            tag: match[1],                // Tag name (e.g., 'basic-nav-side')
            attributes: match[2],
            attributes_obj: getAttributes(match[2]), // Extract attributes as an object
            content: match[3]             // Text between the opening and closing tags
        };


        function insertAttributes(htmlText, attributes = {}) {
            let remaining_attributes = []
            Object.keys(attributes).forEach(key => {
                if (htmlText.includes(`{{${key}}}`)) {
                    htmlText = htmlText.replaceAll(`{{${key}}}=""`, `${key}="${attributes?.[key] || ''}"`)
                    htmlText = htmlText.replaceAll(`{{${key}}}`, attributes?.[key]?.toString() === 'true' ? '' : attributes?.[key])
                } else {
                    remaining_attributes.push(`${key}="${attributes?.[key]}"`)
                }
            })
            const firstGreaterThanIndex = htmlText.indexOf('>');  // Find the index of the first '>'
            // If '>' is found, insert the string before it
            if (firstGreaterThanIndex !== -1) {
                return htmlText.slice(0, firstGreaterThanIndex) + remaining_attributes.join(` `) + htmlText.slice(firstGreaterThanIndex);
            }

            // If '>' is not found, return the original string
            return htmlText;
        }


        // Add the object to the customElements array
        customElements.push('el', elementData);

        // Generate the replacement HTML for the current custom element using the provided function
        const document = cached_pieces?.[elementData?.tag]?.window.document
        const replacementHtml = insertAttributes(document?.querySelector('body')?.innerHTML || '', elementData.attributes_obj);

        const css_text = document?.querySelector('style')?.textContent || ''
        const classes = []
        const class_regex = /class="(.*?)"/g
        let class_match
        while ((class_match = class_regex.exec(replacementHtml)) != null) {
            classes.push(...class_match[1].split(/\s/g))
        }
        add_css_classes(classes)
        const obj_css = parse_css(css_text)
        cached_used_css = { ...cached_used_css, ...obj_css }
        // Replace the current custom element in the HTML text with the replacement HTML
        const newHtml = htmlText.slice(0, match.index) + replacementHtml.replaceAll(`{{children}}`, elementData.content) + htmlText.slice(match.index + match[0].length);

        // Recursively process the rest of the HTML text, starting after the current match
        return extractAndReplaceCustomElements(newHtml, replacementHtmlFn, customElements);
    }

    function render_piece(el, dom, props) {
        const document = dom.window.document
        const body = dom.window.document.querySelector('body')
        let html = body.innerHTML
        html = extractAndReplaceCustomElements(html).modifiedHtml
        const css = dom.window.document.querySelector('style')?.textContent || ''
        const scripts = dom.window.document.querySelector('script')?.textContent || ''
        cached_scripts += scripts
        const obj_css = parse_css(css)
        const filter_properties = ['tag', 'elements', 'text']
        cached_used_css = { ...cached_used_css, ...obj_css }

        props.filter(prop => !filter_properties.includes(prop)).forEach(prop => {
            html = html.replaceAll(`{{${prop}}}=""`, `${prop}="${el?.[prop] || ''}"`)
        })

        return html.replaceAll(`{{children}}`, render_element(el))
    }

    function render_elements(els, pieces, css, scripts) {
        if (pieces) {
            cached_pieces = pieces
        }
        if (css) {
            cached_css = css
        }
        if (scripts) {
            cached_scripts = scripts
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
        <${el?.tag} ${prop_str}>
            ${render_element(el, css)}
</${el?.tag}> `
        }
        )?.join('')
        const medias = {}
        const keyframes = {}
        const other_css = {}
        Object.keys(cached_used_css).forEach(key => {
            if (key.includes('@media')) {
                medias[key] = cached_used_css[key]
            } else if (key.includes('@keyframes')) {
                keyframes[key] = cached_used_css[key]
            } else {
                other_css[key] = cached_used_css[key]
            }
        })
        return { final_html, other_css, medias, keyframes, final_css: deparse_css({ ...other_css, ...medias, ...keyframes }), final_scripts: cached_scripts }


    }
    return { render_element, render_elements, get_pieces, toptal_compress_css, get_css, deparse_css }
}

const template_utils = get_template_utils()
export default template_utils