import React from 'react'
import * as commonS from '../styled'
import * as s from './Header.styled'

function humanReadablePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
}

interface Props {
  siteTitle: string
  description: string
  phoneNumber: string
}

export const Header: React.FC<Props> = props => {
  const { siteTitle, phoneNumber, description } = props

  return (
    <commonS.HeaderContainer>
      <commonS.HeaderFlex>
        <commonS.HeaderStyledLink to="/">
          <commonS.HeaderTitle>{siteTitle}</commonS.HeaderTitle>
        </commonS.HeaderStyledLink>
        <s.HeaderDescription>{description}</s.HeaderDescription>
        <s.PhoneNumberLink href={`tel:${phoneNumber}`}>
          {humanReadablePhoneNumber(phoneNumber)}
        </s.PhoneNumberLink>
      </commonS.HeaderFlex>
    </commonS.HeaderContainer>
  )
}
