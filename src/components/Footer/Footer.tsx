import React from 'react'
import * as commonS from '../styled'

interface Props {
  siteTitle: String
}

export const Footer: React.FC<Props> = ({ siteTitle }) => (
  <commonS.HeaderContainer>
    <commonS.MainContainer>
      <commonS.HeaderStyledLink to="/">
        <commonS.HeaderTitle>{siteTitle}</commonS.HeaderTitle>
      </commonS.HeaderStyledLink>
    </commonS.MainContainer>
  </commonS.HeaderContainer>
)
