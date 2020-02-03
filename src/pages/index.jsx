import React from 'react'
import { Link } from 'gatsby'

import { Layout, Category } from '../components'
import JSONData from '../../content/My-JSON-Content.json'

const IndexPage = () => (
  <Layout>
    {JSONData.categories.map(category => (
      <Category
        key={category.name}
        categoryName={category.name}
        items={category.items}
      />
    ))}
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
