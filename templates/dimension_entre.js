import components from '../components/index.js'

const pages = ['home', 'intro', 'work', 'about', 'contact'].map(item => {
    return {
        link: `/${item}`,
        file_name: `${item === 'home' ? 'index' : item}.html`,
        link_title: `${item}`,
        title: `Dimension ${item}`,
        css: ['dimension_entre.css'],
        body: {
            elements: [{
                tag: 'dimension-home',
                class: 'wrapper',

            }]
        }
    }

})

function template() {
    return {
        title: "Dimension Template",
        logo: "Dimension Logo",
        pages: pages
    }
}

const plate = template()
export default plate