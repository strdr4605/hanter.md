import React, { useState, useCallback } from 'react'
// import { Link } from 'gatsby'

import { Layout, Category, RightModal } from '../components'
import JSONData from '../../content/My-JSON-Content.json'
import { Item, ContentObj } from '../types'

const contentObj: ContentObj = JSONData;
const IndexPage = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  const selectItem = useCallback((item: Item) => setSelectedItem(item), [])
  const removeSelectedItem = useCallback(() => setSelectedItem(null), [])

  return (
    <Layout>
      {contentObj.categories.map(category => (
        <Category
          key={category.name}
          categoryName={category.name}
          items={category.items}
          selectItem={selectItem}
        />
      ))}
      <RightModal selectedItem={selectedItem} closeModal={removeSelectedItem} />
      {/* <Link to="/page-2/">Go to page 2</Link> */}
    </Layout>
  )
}

export default IndexPage
