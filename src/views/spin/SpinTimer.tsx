import { useTheme } from '@mui/material/styles'
import { ApexOptions } from 'apexcharts'

import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const SpinTimer = (props: any) => {
    const { timer } = props
    // ** Hook
    const theme = useTheme()
    const options: ApexOptions = {
        fill: {
            type: "gradient",
            gradient: {
                shade: "dark",
                type: "vertical",
                gradientToColors: ["#87D4F9"],
                stops: [0, 100]
            }
        },
        labels: ["Seconds"],
        chart: {
            sparkline: { enabled: true }
        },
        stroke: { lineCap: 'round' },
        colors: [hexToRGBA(theme.palette.primary.main, 1)],
        plotOptions: {
            radialBar: {
                hollow: { size: '66%' },
                dataLabels: {
                    show: true,
                    name: {
                        offsetY: +20,
                        show: true,
                        color: "#888",
                        fontSize: "14px"
                    },
                    value: {
                        offsetY: -25,
                        color: "#111",
                        fontSize: "40px",
                        fontWeight: 'bold',
                        show: true,
                        formatter: function (val) {
                            var time = Math.round(val * 1.8)
                            return time + ''
                        }
                    }
                }
            }
        },
        grid: {
            padding: {
                bottom: -0
            }
        },
        states: {
            hover: {
                filter: { type: 'none' }
            },
            active: {
                filter: { type: 'none' }
            }
        }
    }

    return (
        <ReactApexcharts type='radialBar' height={140} series={[timer / 180 * 100]} options={options} />
    )
}

export default SpinTimer
