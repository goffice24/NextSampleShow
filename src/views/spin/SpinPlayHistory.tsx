import { useState, } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid'

import RenderUserAvatar from 'src/views/components/avatars/RenderUserAvatar'
import { HistoryCellType } from 'src/types/apps/spinTypes';

const SpinPlayHistory = (props: any) => {

    const { row } = props
    const [sortModel, setSortModel] = useState<GridSortModel>([
        {
            field: 'date',
            sort: 'desc',
        },
    ]);

    const columns: GridColDef[] = [
        {
            flex: 4,
            minWidth: 160,
            field: 'name',
            headerName: 'Winner',
            renderCell: ({ row }: HistoryCellType) => {
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {RenderUserAvatar(row.avatar, row.name)}
                        <div>
                            <p style={{ margin: '0' }}>{row.name}</p>
                            <p style={{ margin: '0' }}>$ {row.amount}</p>
                        </div>
                    </Box>
                )
            }
        },
        {
            flex: 2,
            field: 'chance',
            minWidth: 100,
            headerName: 'Chance',
            renderCell: ({ row }: HistoryCellType) => {
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {row.chance} %
                    </Box>
                )
            }
        },
        {
            flex: 2,
            minWidth: 100,
            field: 'price',
            headerName: 'Price',
            renderCell: ({ row }: HistoryCellType) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                        sx={{ color: 'text.secondary', padding: '3px 10px', borderRadius: '5px', minWidth: '70px', textTransform: 'capitalize', textAlign: 'center' }}
                    >
                        $ {row.price} 
                    </Typography>
                </Box>
            )
        },
        {
            flex: 4,
            minWidth: 200,
            field: 'date',
            headerName: 'Date',
            renderCell: ({ row }: HistoryCellType) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                        sx={{ color: 'text.secondary', padding: '3px 10px', borderRadius: '5px', minWidth: '70px', textTransform: 'capitalize', textAlign: 'center' }}
                    >
                        {row.date}
                    </Typography>
                </Box>
            )
        },
    ]

    return (
        <Card>
            <Typography sx={{ padding: '15px' }}>Last Game</Typography>
            <DataGrid sortModel={sortModel} onSortModelChange={(newSortModel) => setSortModel(newSortModel)} autoHeight hideFooter rows={row} columns={columns} disableSelectionOnClick pagination={undefined} />
        </Card>
    )
}

export default SpinPlayHistory
