import React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import { Header } from '../Header'
import { Footer } from '../Footer'
import './layout.css'
import * as s from './Layout.styled'

export const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            description
            phoneNumber
          }
        }
      }
    `}
    render={data => (
      <s.Flex>
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: 'Sample' },
            { name: 'keywords', content: 'sample, something' },
          ]}
        >
          <html lang="en" />
        </Helmet>
        <Header
          siteTitle={data.site.siteMetadata.title}
          phoneNumber={data.site.siteMetadata.phoneNumber}
          description={data.site.siteMetadata.description}
        />
        <s.Content>{children}</s.Content>
        <Footer siteTitle={data.site.siteMetadata.title} />
      </s.Flex>
    )}
  />
)
