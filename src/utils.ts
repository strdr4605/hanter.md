/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
export function getImage(image: string): string {
  return require(`../content/images/${image}`)
}
