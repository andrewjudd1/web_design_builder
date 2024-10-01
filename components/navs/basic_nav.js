const links = [
    { tag: 'basic-link', href: 'data.business.nav.link_1.link', class: "row-between", text: 'data.business.nav.link_1.name' },
    { tag: 'basic-link', href: 'data.business.nav.link_2.link', class: "row-between", text: 'data.business.nav.link_2.name' },
    { tag: 'basic-link', href: 'data.business.nav.link_3.link', class: "row-between", text: 'data.business.nav.link_3.name' }
]

const basic_nav = [
    {
        tag: 'basic-nav',
        elements: [{
            tag: 'ul',
            class: "blank-ul row-50",
            elements: links
        }]
    },
    {
        tag: 'basic-nav-side',
        elements: [{
            tag: 'ul',
            class: "blank-ul col-50",
            elements: links
        }]
    },
]


export default basic_nav