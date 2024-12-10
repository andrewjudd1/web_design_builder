const root_url = 'http://localhost:5500/designs/frosted_glass'

const data = {
    name: "Frosted Glass",
    description: "A Glass Company",
    logo: {
        name: 'Frosted Glass',
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
        name: "Testimonials",
        link: "testimonials"
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

export default data