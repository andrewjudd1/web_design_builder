function data(options) {
    const root_url = options?.root_url || ''

    const data = {
        name: "Rooted Wellness",
        description: "A Wellness Company",
        logo: {
            name: 'Rooted Wellness',
            link: `${root_url}/`
        },
        nav: {}
    }
    const links = [
        // {
        //     name: "Home",
        //     link: ""
        // },
        {
            name: "About",
            link: "about"
        },
        {
            name: "Services",
            link: "services"
        },
        {
            name: "Tips",
            link: "tips"
        },
        {
            name: "Contact",
            link: "contact"
        }
    ]
    links.forEach((item, index) => {
        item.link = `${root_url}/${item.link}`
        data.nav[`link_${index}`] = item
    })
    return data
}

export default data