import components from '../components/index.js'

const pages = ['home', 'services', 'about', 'testimonials', 'contact'].map(item => {
    return {
        link: `/${item}`,
        file_name: `${item === 'home' ? 'index' : item}.html`,
        link_title: `${item}`,
        title: `Frosted ${item}`,
        css: ['frosted.css'],
        body: {
            elements: [{
                tag: 'frosted-home',
                class: '',
                elements: [
                    {
                        tag: 'a',
                        href: 'about',
                        text: 'About'
                    }
                ]
            }]
        }
    }

})

function template() {
    return {
        title: "Frosted Template",
        logo: "Frosted Logo",
        pages: pages
    }
}

const plate = template()
export default plate