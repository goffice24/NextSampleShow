import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress';
import { ApexOptions } from 'apexcharts'

import ReactApexcharts from 'src/@core/components/react-apexcharts'
import SpinTimer from './SpinTimer'

const SpinWheel = (props: any) => {
  const { row, timer, loading } = props

  const theme = useTheme()

  const [total, setTotal] = useState(0)
  const [plus, setPlus] = useState(0)
  const [labels, setLabels] = useState([""])
  const [colors, setColors] = useState(["#dfdfdf11"])
  const [values, setValues] = useState([100])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
    if (row.length > 0) {
      const l: any = []
      const c: any = []
      const v: any = []

      let t = 0;
      let p = 0;

      row.forEach((element: { [x: string]: any }) => {
        l.push(element['name'] + " / $" + element['amount'])
        c.push(element['color'])
        v.push(element['chance'])
        t = t + parseInt(element['amount'])
        p = element['chance']
      });
      setPlus(p)
      setColors(c)
      setLabels(l)
      setValues(v)
      setTotal(t)
      setLoaded(true)
    } else {
      setPlus(0)
      setColors(["#d9d9d930"])
      setLabels([""])
      setValues([100])
      setTotal(0)
      setLoaded(true)
    }
  }, [row])

  const options: ApexOptions = {
    legend: { show: false },
    stroke: { width: 5, colors: [theme.palette.background.paper] },
    colors: colors,
    labels: labels,
    tooltip: {
      y: { formatter: (val: number) => `${val}%` }
    },
    dataLabels: {
      enabled: false
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      pie: {
        customScale: 1,
        donut: {
          size: '60%',
          labels: {
            show: false,
            name: { show: false },
            total: {
              label: 'BANK',
              show: true,
              formatter(val) {
                return typeof val === 'string' ? `${val}%` : ''
              }
            },
            value: {
              offsetY: 6,
              formatter(val) {
                return `${val}%`
              }
            }
          }
        }
      }
    }
  }

  return (
    <Card sx={{ position: "relative" }}>
      {
        loading &&
        <div style={{ display: "flex", position: "absolute", left: 0, top: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center", background: "rgb(37,37,37,0.4)", zIndex: 10, paddingTop: 50 }}>
          <CircularProgress />
        </div>
      }
      <CardContent
        sx={{
          '& .apexcharts-canvas .apexcharts-datalabel-value': {
            fontWeight: 600,
            fontSize: '2rem !important',
            fill: theme.palette.text.secondary
          }
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant='h6' sx={{ mr: 1.5 }}>
            ${total}
          </Typography>
          <Typography variant='subtitle2' sx={{ color: 'success.main' }}>
            +{plus}%
          </Typography>

        </Box>
        <Typography variant='body2' sx={{ color: theme.palette.mode == "light" ? '#275bcf' : '#ffffaa', fontWeight: 'bold' }}>Game Bank</Typography>
        <div id="pp">
          <ReactApexcharts type='donut' height={300} options={options} series={values} id="spiner" />
          <Typography className='board' id="timer" sx={{ width: '100%', position: 'absolute', top: '68px', left: '1px' }}>
            <SpinTimer timer={timer} />
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default SpinWheel
