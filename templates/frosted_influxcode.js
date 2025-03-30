import components from '../components/index.js'
const page_options = {
    home: {
        head: `<meta name="title" content="Take control of your software and design | Influxcode">
<meta name="description" content="Professional software engineering and design services to help you generate more leads and build a better online presence.">
<meta name="keywords" content="software, design, web development, web design, Andrew Judd, Influxcode">`
    },
    about: {
        head: `<meta name="title" content="About Influxcode | Innovative Software">
<meta name="description" content="Learn more about Influxcode, a software engineering and web design company passionate about bringing in the best code for your business">
<meta name="keywords" content="about, software, design, web development, web design, Andrew Judd, Influxcode">`
    },
    services: {
        head: `<meta name="title" content="Videography Services | Weddings & More">
<meta name="description" content="Explore professional videography services including weddings, first looks, and bridals. Custom packages available for your special moments.">
<meta name="keywords" content="wedding videography, first looks, bridal videos, affordable videographer">
<link rel="preload" as="image" href="https://airbucket-01.s3.us-east-1.amazonaws.com/website/luis-tosta-MEZDyn98La8-unsplash.webp" />
<link rel="preload" as="image" href="https://airbucket-01.s3.us-east-1.amazonaws.com/website/emily-finch-Un4EyaC9CYs-unsplash+2.webp" />
<link rel="preload" as="image" href="https://airbucket-01.s3.us-east-1.amazonaws.com/website/lawrence-suzara-p-ZVPT5tAzY-unsplash.webp" />

`
    },
    portfolio: {
        head: `<meta name="title" content="Videography Portfolio | Afton Ceja">
<meta name="description" content="View Afton Ceja's portfolio of professional videography work. Watch samples of weddings, first looks, and bridals.">
<meta name="keywords" content="videography portfolio, wedding videos, sample videography work">
<link rel="preload" as="image" href="https://airbucket-01.s3.us-east-1.amazonaws.com/website/abbygale_brandon.webp" />
`
    },
    contact: {
        head: `<meta name="title" content="Contact Afton Ceja | Videography Inquiries">
<meta name="description" content="Reach out to Afton Ceja for professional videography services. Book your session or ask about packages and pricing.">
<meta name="keywords" content="contact videographer, book videography session, wedding inquiries">`
    }

}
const pages = ['Home', 'About', 'Services', 'Portfolio', 'Contact'].map(item => {
    return {
        link: `/${item}`,
        file_name: `${item === 'Home' ? 'index' : item.toLowerCase()}.html`,
        link_title: `${item}`,
        title: `INFLUXCODE - ${item}`,
        css: ['frosted_influxcode.css'],
        global_head: `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Raleway:wght@400;700&display=swap" as="style" >
<noscript>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Raleway:wght@400;700&Ubuntu+Mono:wght@400;700&Roboto+Serif:wght@400;700&display=swap" rel="stylesheet">
</noscript>
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