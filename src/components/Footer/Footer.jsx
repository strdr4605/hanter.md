import React from 'react'
import * as commonS from '../styled'

export const Footer = ({ siteTitle }) => (
  <commonS.HeaderContainer>
    <commonS.MainContainer>
      <commonS.HeaderStyledLink to="/">
        <commonS.HeaderTitle>{siteTitle}</commonS.HeaderTitle>
      </commonS.HeaderStyledLink>
    </commonS.MainContainer>
  </commonS.HeaderContainer>
)
