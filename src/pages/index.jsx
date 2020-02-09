import React, { useState, useCallback } from 'react'
import { Link } from 'gatsby'

import { Layout, Category, RightModal } from '../components'
import JSONData from '../../content/My-JSON-Content.json'

const IndexPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])

  return (
    <Layout>
      {JSONData.categories.map(category => (
        <Category
          key={category.name}
          categoryName={category.name}
          items={category.items}
          openModal={openModal}
        />
      ))}
      <RightModal isModalOpen={isModalOpen} closeModal={closeModal} />
      <Link to="/page-2/">Go to page 2</Link>
    </Layout>
  )
}

export default IndexPage
