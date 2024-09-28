
const basic_header = {
    tag: 'basic-nav',
    elements: [
        { tag: 'basic-logo', text: 'data.business.name' },
        {
            tag: 'ul',
            class: "blank-ul row-15",
            elements: [
                { tag: 'basic-link', class: "row-between", text: 'data.business.nav.link_1' },
                { tag: 'basic-link', class: "row-between", text: 'data.business.nav.link_2' },
                { tag: 'basic-link', class: "row-between", text: 'data.business.nav.link_3' }
            ]
        }
    ]
}

export default basic_header