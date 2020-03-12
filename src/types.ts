export interface List {
  name: string
  elements: string[]
}

export interface Item {
  id: string
  imgSrc: string
  title: string
  list: List
  description: string
}

export interface Category {
  name: string
  items: Item[]
}

export interface ContentObj {
  categories: Category[]
}
