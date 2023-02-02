import { useContext } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { darken, lighten } from '@mui/material/styles';
import { DataGrid, GridColDef } from '@mui/x-data-grid'

import { AuthContext } from 'src/context/AuthContext'
import RenderUserAvatar from 'src/views/components/avatars/RenderUserAvatar'
import { CardCellType } from 'src/types/apps/spinTypes';

const getBackgroundColor = (color: string, mode: string) => mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const SpinPlayerCard = (props: any) => {

  const { row, winner } = props
  const { user } = useContext<any>(AuthContext)

  const columns: GridColDef[] = [
    {
      flex: 5,
      minWidth: 100,
      field: 'name',
      headerName: 'USER',
      renderCell: ({ row }: CardCellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            {row.id == winner && <img alt='trophy' src='/images/cards/trophy.png' style={{ width: 20, position: 'absolute', left: -5, bottom: 0, }} />}
            {RenderUserAvatar(row.avatar, row.name)}
            {row.name}
          </Box>
        )
      }
    },
    {
      flex: 3,
      field: 'rate',
      minWidth: 100,
      headerName: 'RATE',
      renderCell: ({ row }: CardCellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            $ {row.amount}
          </Box>
        )
      }
    },
    {
      flex: 2,
      minWidth: 100,
      field: 'chance',
      headerName: 'CHANCE',
      renderCell: ({ row }: CardCellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            sx={{ color: 'text.secondary', background: row.color, padding: '3px 10px', borderRadius: '5px', minWidth: '70px', textTransform: 'capitalize', textAlign: 'center', transform: 'skew(-10deg)' }}
          >
            {row.chance} %
          </Typography>
        </Box>
      )
    },
  ]

  return (
    <Card sx={{
      '& .super-app-theme--winner': {
        bgcolor: (theme) =>
          getBackgroundColor(theme.palette.error.main, theme.palette.mode),
      },
    }}>
      <DataGrid autoHeight hideFooter rows={row} columns={columns} disableSelectionOnClick pagination={undefined}
        getRowClassName={(params) => `super-app-theme--${params.row.id == winner ? "winner" : "player"}`} />
    </Card>
  )
}

export default SpinPlayerCard
