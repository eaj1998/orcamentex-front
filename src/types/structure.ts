
export interface SnackbarItem {
    type: string
    message: string
    isVisible: boolean
  }

export interface productOrder {
    product: product
    price: Number
    quantity: Number
}

export interface customer {
  _id: string
  name:string
  cpfCnpj: string
}

export interface product {
  _id: string
  name: string
  code: string

}