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
                file_name: "about.html",
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
                link: "/services",
                link_title: "Services",
                title: "This is the services template",
                file_name: "services.html",
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
                link: "/tips",
                link_title: "Tips",
                title: "This is the tips template",
                file_name: "tips.html",
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
                link: '/contact', link_title: "Contact", title: 'this is the contact template', file_name: 'contact.html', css: {
                    file: "styles.css"
                },
                body: {
                    elements: [
                        components.basic_header,
                    ]
                }
            }
        ]
    }
}

const plate = template()
export default plate