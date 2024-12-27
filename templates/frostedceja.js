import components from '../components/index.js'

const pages = ['home', 'about', 'services', 'portfolio', 'contact'].map(item => {
    return {
        link: `/${item}`,
        file_name: `${item === 'home' ? 'index' : item}.html`,
        link_title: `${item}`,
        title: `Frosted ${item}`,
        css: ['frostedceja.css'],
        body: {
            elements: [{
                tag: `frostedceja-${item}`,
                class: '',
                elements: [

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