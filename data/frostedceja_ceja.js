const root_url = 'http://localhost:5500/designs/frostedceja_ceja'

const data = {
    name: "Afton Ceja Videography",
    description: "A videography Company",
    logo: {
        name: 'CEJAFILMS',
        link: `${root_url}/`
    },
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
    data.nav[`link_${index}`] = item
})

export default data