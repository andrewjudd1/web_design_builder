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
                        {
                            tag: "div",
                            elements: [
                                {
                                    tag: "h1",
                                    text: "data.business.name",
                                    class: "title"
                                },
                                {
                                    tag: "p",
                                    text: "data.business.description",
                                    class: "p-title"
                                },
                                {
                                    tag: "fade-hover",
                                    href: "contact",
                                    text: "Contact Us Today",
                                    style: "width: 200px;",
                                    class: "p-title"
                                },
                                {
                                    tag: "div",
                                    elements: [
                                        {
                                            tag: "h1",
                                            text: "hi",
                                            class: "title"
                                        }
                                    ],
                                    class: ""
                                }
                            ],
                            class: "title-container"
                        }
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