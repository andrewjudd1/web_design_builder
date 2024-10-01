import basic_nav from "../navs/basic_nav.js"

const links = [
    { tag: 'basic-link', href: 'data.business.nav.link_1.link', class: "row-between", text: 'data.business.nav.link_1.name' },
    { tag: 'basic-link', href: 'data.business.nav.link_2.link', class: "row-between", text: 'data.business.nav.link_2.name' },
    { tag: 'basic-link', href: 'data.business.nav.link_3.link', class: "row-between", text: 'data.business.nav.link_3.name' }
]
const basic_header = {
    tag: 'header',
    class: 'row-between',
    elements: [
        { tag: 'basic-logo', href: 'data.business.logo.link', text: 'data.business.logo.name' },
        {
            tag: 'basic-nav',
            elements: links
        },
        {
            tag: 'ul',
            class: "blank-ul row-15",
            elements: [
                { tag: 'basic-link', href: 'data.business.nav.link_4.link', class: "row-between", text: 'data.business.nav.link_4.name' },

            ]
        }
    ]
}

export default basic_header