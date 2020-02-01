import React from 'react'
import * as commonS from '../styled'

export const Footer = ({ siteTitle }) => (
  <commonS.HeaderContainer>
    <commonS.HeaderStyledLink to="/">
      <commonS.HeaderTitle>{siteTitle}</commonS.HeaderTitle>
    </commonS.HeaderStyledLink>
  </commonS.HeaderContainer>
)
