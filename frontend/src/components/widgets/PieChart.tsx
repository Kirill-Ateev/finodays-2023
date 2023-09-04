import styled from '@emotion/styled'
import ReactECharts from 'echarts-for-react'

export const PieChart = () => {
  const options = {
    textStyle: {
      fontFamily: 'Roboto',
    },
    title: {
      text: 'Номенклатура ТТР',
      left: 'center',
      top: 10,
    },
    tooltip: {
      trigger: 'item',
      formatter: (param: any) => {
        return `${param.marker} ${param.data.name}: ${param.data.value}%`
      },
    },
    legend: {
      orient: 'horizontal',
      bottom: 'bottom',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        color: ['#14A983', '#16437E', '#69BCFF', '#BAE7FF'],
        label: {
          formatter: (param: any) => {
            return `${param.data.value}%`
          },
        },
        data: [
          { value: 20, name: 'Газ NG' },
          { value: 31, name: 'Нефть Urals' },
          { value: 14, name: 'Лес' },
          { value: 15, name: 'Иные' },
        ],
        labelLine: {
          lineStyle: {
            color: 'white',
          },
          length: 1,
          length2: 1,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
  return (
    <StyledContainer>
      <ReactECharts option={options} style={{ height: 315 }} />
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
  box-sizing: border-box;
  border-radius: 20px;
  border: 1px solid #f2f2f2;
`
