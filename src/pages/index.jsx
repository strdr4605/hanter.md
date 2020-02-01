import React from 'react'
import { Link } from 'gatsby'

import { Layout } from '../components'
import JSONData from '../../content/My-JSON-Content.json'

const IndexPage = () => (
  <Layout>
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby + Tailwind CSS + Styled Components site</p>
    <p>Now go build something great.</p>
    <h1>{JSONData.title}</h1>
    <ul>
      {JSONData.content.map(data => {
        return <li key={`content_item_${data.item}`}>{data.item}</li>
      })}
    </ul>
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
