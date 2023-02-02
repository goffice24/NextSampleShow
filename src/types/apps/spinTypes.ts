// **
export type SpinPlayerType = {
  id: string
  name: string
  avatar: string
  amount: number
  chance: number
  color: string
  address: string
}

export type SpinPlayHistoryType = {
  id: string
  name: string
  avatar: string
  amount: number
  chance: number
  price: number
  date: string
  address: string
}

export type  HistoryCellType = {
  row: SpinPlayHistoryType
}

export type  CardCellType = {
  row: SpinPlayerType
}
