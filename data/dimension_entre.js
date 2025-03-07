function data(options) {
    const root_url = options?.root_url || ''

    const data = {
        name: "Rooted Wellness",
        description: "A Wellness Company",
        logo: {
            name: 'Rooted Wellness',
            link: `${root_url}/`
        },
        root_url,
        nav: {}
    }
    const links = [
        // {
        //     name: "Home",
        //     link: ""
        // },
        {
            name: "Intro",
            link: "intro"
        },
        {
            name: "Work",
            link: "work"
        },
        {
            name: "About",
            link: "about"
        },
        {
            name: "Contact",
            link: "contact"
        }
    ]
    links.forEach((item, index) => {
        item.link = `${root_url}/${item.link}`
        data.nav[`${index}`] = item
    })
    return data
}
export default data