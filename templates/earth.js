import components from '../components/index.js'



function template() {
    return {
        title: "Sky Template",
        logo: "Sky Logo",
        pages: [
            {
                link: "/home",
                file_name: "index.html",
                link_title: "Home",
                title: "This is the sky template",
                css: {
                    file: "styles.css"
                },
                body: {
                    elements: [
                        components.basic_header,
                    ]
                }
            },
            {
                link: "/about",
                link_title: "About",
                title: "This is the about template",
                file_name: "about.html"
            },
            { link: '/contact', link_title: "Contact", title: 'this is the contact template', file_name: 'contact.html' }
        ]
    }
}

const plate = template()
export default plate