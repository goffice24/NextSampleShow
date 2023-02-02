
export type PlayerType = {
  address: string
  avatar: string
  name: string
}

export type CoinflipRoomType = {
  id: string
  amount: string
  index: string
  player1:PlayerType
  player2:PlayerType
  side: string
  status: 'init' | 'wait'
  update: string
  winner: string
}

export type CoinflipCellType = {
  row: CoinflipRoomType
}