function data(options) {
    const root_url = options?.root_url || ''

    const func_data = {
        name: "Influxcode",
        description: "A Software engineering and web design company",
        logo: {
            name: 'INFLUXCODE',
            link: `${root_url}/`
        },
        social: {
            instagram: `${root_url}`,
            linkedin: `${root_url}`,
            facebook: `${root_url}`,
        },
        email: 'andrewjudd111@gmail.com',
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