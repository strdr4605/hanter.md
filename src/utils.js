/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
export function getImage(image) {
  return require(`../content/images/${image}`)
}
