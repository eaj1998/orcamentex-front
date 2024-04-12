
export interface SnackbarItem {
    type: string
    message: string
    isVisible: boolean
  }

export interface productOrder {
    product: String
    price: Number
    quantity: Number
}

export interface customer {
  _id: string
  name:string
  cpfCnpj: string
}
  