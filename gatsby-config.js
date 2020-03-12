module.exports = {
  siteMetadata: {
    title: 'Hanter.md',
    description: 'Accesorii pentru mașini',
    phoneNumber: '079089999'
  },
  pathPrefix: "/hanter.md",
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-tailwindcss',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Hanter.md',
        short_name: 'Hanter.md',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/gatsby-icon.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-offline',
  ],
}
