import React from 'react'
import * as commonS from '../styled'

export const Header = ({ siteTitle }) => (
  <commonS.HeaderContainer>
    <commonS.MainContainer>
      <commonS.HeaderStyledLink to="/">
        <commonS.HeaderTitle>{siteTitle}</commonS.HeaderTitle>
      </commonS.HeaderStyledLink>
    </commonS.MainContainer>
  </commonS.HeaderContainer>
)
