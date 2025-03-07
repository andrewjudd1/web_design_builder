import components from '../components/index.js'
const page_options = {
    home: {
        head: `<meta name="title" content="Capture the Moments That Matter Most | Afton Ceja Videography">
<meta name="description" content="Professional videography services to help you preserve your most cherished memories. Weddings, engagements, and special events beautifully captured.">
<meta name="keywords" content="videography, wedding videography, event videography, Afton Ceja">`
    },
    about: {
        head: `<meta name="title" content="About Afton Ceja | Passionate Videographer">
<meta name="description" content="Learn more about Afton Ceja, a videographer passionate about capturing life's most precious moments through film.">
<meta name="keywords" content="about videographer, Afton Ceja, storytelling through video">`
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
        title: `CEJAFILMS - ${item}`,
        css: ['frosted_frosted_andrew.css'],
        global_head: `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Raleway:wght@400;700&display=swap" as="style" >
<noscript>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Raleway:wght@400;700&display=swap" rel="stylesheet">
</noscript>
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
`,
        ...page_options[item.toLowerCase()],
        body: {
            elements: [{
                tag: `frostedfrosted_andrew-${item.toLowerCase()}`,
                class: '',
                elements: [

                ]
            }]
        }
    }

})

function template() {
    return {
        title: "CEJAFILMS",
        logo: "CEJAFILMS Logo",
        pages: pages,
        root_url: '/designs/frosted_frosted_andrew'
    }
}

const plate = template()
export default plate