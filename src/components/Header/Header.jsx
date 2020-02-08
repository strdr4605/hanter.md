import React from 'react'
import * as commonS from '../styled'
import * as s from './Header.styled'

/**
 * Transform '079089999' into '079 089 999'
 * @param {string} phoneNumber
 * @returns {string}
 */
function humanReadablePhoneNumber(phoneNumber) {
  return phoneNumber.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
}


/**
 *
 * @param {{
 *  siteTitle: string,
 *  description: string,
 *  phoneNumber: string,
 * }} props
 */
export const Header = ({ siteTitle, phoneNumber, description }) => (
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
