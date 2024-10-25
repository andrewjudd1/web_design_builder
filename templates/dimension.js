import components from '../components/index.js'



function template() {
    return {
        title: "Dimension Template",
        logo: "Dimension Logo",
        pages: [
            {
                link: "/home",
                file_name: "index.html",
                link_title: "Home",
                title: "Dimension Template",
                css: ['dimension.css'],
                body: {
                    elements: [{
                        tag: 'dimension-home',
                        class: 'wrapper',

                    }]
                }
            },

        ]
    }
}

const plate = template()
export default plate