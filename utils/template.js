import fs from 'fs/promises'
import template_utils from './template_utils.js'
import templates from '../templates/index.js'
function get_template_util() {
    let cached_pieces
    let cached_css
    let cached_used_css = {}
    async function get_template(design_name = 'sky') {
        if (!design_name) {
            throw new Error('Design not found.')
        }
        const template = templates?.[design_name]
        return template
    }
    async function create_page(page) {
        if (!cached_pieces) {
            cached_pieces = await template_utils.get_pieces(cached_pieces)
        }
        if (!cached_css) {
            cached_css = await template_utils.get_css(cached_css, page.css)
        }

        const data = template_utils.render_elements(page?.body?.elements || [], cached_pieces, cached_css, '') || {}
        if (!data?.final_css) {
            data.final_css = ''
        }

        const keep_css = [':root', 'html', 'body', 'a', '*', 'h1']
        const keep_css_obj = Object.keys(cached_css).reduce((curr, key) => {
            if (keep_css.some(keep_key => key.includes(keep_key))) {
                return { ...curr, [key]: cached_css[key] }
            } else {
                return curr
            }
        }, {})

        const medias = {}
        const keyframes = {}
        const other_css = {}
        Object.keys(cached_css).forEach(key => {
            if (key.includes('@media')) {
                medias[key] = cached_css[key]
            } else if (key.includes('@keyframes')) {
                keyframes[key] = cached_css[key]
            } else {
                other_css[key] = cached_css[key]
            }
        })

        data.final_css = `${cached_css?.imports?.join('\n')}\n${template_utils.deparse_css({ ...other_css })}\n\n${template_utils.deparse_css({ ...data?.other_css, ...keyframes, ...data.keyframes, ...medias, ...data.medias })}`
        const html = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title}</title>
    ${page?.global_head || ''}
    ${page?.head || ''}
</head>
<style>
${data?.final_css}
</style>
<body>
    ${data?.final_html || ''}     
</body >

</html > `
        return html
    }
    return { create_page, get_template }
}

const template_util = get_template_util()
export default template_util