import components from '../components/index.js'
const page_options = {
    home: {
        head: `<meta name="title" content="Take control of your software and design | Influxcode">
<meta name="description" content="Professional software engineering and design services to help you generate more leads and build a better online presence.">
<meta name="keywords" content="software, design, web development, web design, Andrew Judd, Influxcode">`
    },

    ['Start Free Trial']: {
        head: `<meta name="title" content="Sign up">
    <meta name="description" content="Personalized Email and SMS marketing to automate outreach to your clients in a personalized way instantly.">
    <meta name="keywords" content="marketing, automation, Email, SMS">
    `
    },
    ['Sign Up']: {
        head: `<meta name="title" content="Sign up">
    <meta name="description" content="Personalized Email and SMS marketing to automate outreach to your clients in a personalized way instantly.">
    <meta name="keywords" content="marketing, automation, Email, SMS">
    `
    },

}
const pages = ['Home', 'Signup', 'Signin'].map(item => {
    return {
        link: `/${item}`,
        file_name: `${item === 'Home' ? 'index' : item.toLowerCase()}.html`,
        link_title: `${item}`,
        title: `INFLUXCODE - ${item}`,
        css: ['frosted_influxcode.css'],
        global_head: `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Special+Gothic:wght@400..700&display=swap" rel="stylesheet">

<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
`,
        ...page_options[item.toLowerCase()],
        body: {
            elements: [{
                tag: `frostedinfluxcode-${item.toLowerCase()}`,
                class: '',
                elements: [

                ]
            }]
        }
    }

})

function template() {
    return {
        title: "INFLUXCODE",
        logo: "INFLUXCODE Logo",
        pages: pages,
        root_url: '/designs/frosted_influxcode'
    }
}

const plate = template()
export default plate