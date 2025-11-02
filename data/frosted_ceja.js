function data(options) {
    const root_url = options?.root_url || ''

    const func_data = {
        name: "Afton Ceja Videography",
        description: "A videography Company",
        logo: {
            name: 'CEJAFILMS',
            link: `${root_url}/`,
            url_alt_1: 'https://s3.us-east-1.amazonaws.com/assets.influxcode.io/cejafilms/cejafilms_white_no_bg.png',
            url_alt_2: 'https://s3.us-east-1.amazonaws.com/assets.influxcode.io/cejafilms/ceja_films_nb_rect.png',
            url_alt_3: 'https://s3.us-east-1.amazonaws.com/assets.influxcode.io/cejafilms/ceja_films_nb_white_long.png',
            url: 'https://s3.us-east-1.amazonaws.com/assets.influxcode.io/cejafilms/ceja_films_nb_white_long.webp',
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