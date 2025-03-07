function data(options) {
    const root_url = options?.root_url || ''

    const func_data = {
        name: "Afton Ceja Videography",
        description: "A videography Company",
        logo: {
            name: 'CEJAFILMS',
            link: `${root_url}/`
        },
        social: {
            instagram: `https://www.instagram.com/ceja.films?igsh=MWIxeG4yMXlqcWtmdw%3D%3D&utm_source=qr`,
            linkedin: `${root_url}`,
            facebook: `${root_url}`,
        },
        email: 'aftoncejafilms@gmail.com',
        nav: {}
    }
    const links = [
        {
            name: "Home",
            link: ""
        },
        {
            name: "About",
            link: "about"
        },
        {
            name: "Services",
            link: "services"
        },
        {
            name: "Portfolio",
            link: "portfolio"
        },
        {
            name: "Contact",
            link: "contact"
        }
    ]
    links.forEach((item, index) => {
        item.link = `${root_url}/${item.link}`
        func_data.nav[`link_${index}`] = item
    })
    return func_data
}
export default data