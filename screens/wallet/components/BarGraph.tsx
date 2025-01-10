import React from 'react'
import { BarChart, barDataItem } from 'react-native-gifted-charts'

type Props = {
  barData: barDataItem[] | undefined
  moneyIn?: boolean
}

const BarGraph = ({ barData, moneyIn }: Props) => {
  return (
    <BarChart
      yAxisExtraHeight={20}
      height={150}
      initialSpacing={0}
      spacing={45}
      hideAxesAndRules
      yAxisLabelWidth={10}
      yAxisThickness={0}
      xAxisThickness={0}
      data={barData}
      barWidth={81}
      cappedBars
      capColor={moneyIn ? '#62A446' : '#F14B3B'}
      capRadius={4}
      capThickness={4}
      showGradient
      // isAnimated
      gradientColor={
        moneyIn ? 'rgba(214, 241, 202,1)' : 'rgba(236, 187, 182, 1)'
      }
      frontColor={
        moneyIn ? 'rgba(241, 253, 235,0.3)' : 'rgba(250, 238, 237, 0.3)'
      }
      xAxisLabelTextStyle={{
        textTransform: 'uppercase',
        color: '#536171',
        fontFamily: 'moderat-regular',
        fontSize: 16,
      }}
    />
  )
}

export default BarGraph
