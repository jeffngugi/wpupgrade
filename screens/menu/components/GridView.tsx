import React from 'react'
import { Column, HStack } from 'native-base'
import GridCard from './GridCard'
import { windowWidth } from '~utils/appConstants'
import { useMenuItems } from '~utils/hooks/useMenuItems'

const columnCount = 3

const GridView = () => {
  const { menuItems } = useMenuItems()
  const gridArray: any = [[]]
  const menuItemsToGridArray = (totalColumns: number) => {
    let countColumns = 1
    for (let i = 0; i < menuItems.length; i++) {
      gridArray[gridArray.length - 1].push(menuItems[i])
      if (countColumns <= totalColumns) {
        countColumns++
      }
      if (countColumns > totalColumns && i !== menuItems.length - 1) {
        countColumns = 1
        gridArray.push([])
      }
    }

    return gridArray
  }

  const gridArdray = menuItemsToGridArray(columnCount)

  const renderGrid = (gridArray: any[]) => {
    let count = 0
    return gridArray.map((row, rowIndex) => {
      return (
        <HStack justifyContent={'space-between'} key={rowIndex.toString()}>
          {row.map((col: any, index: number) => {
            count++
            const remainderArray = new Array(columnCount - row.length)
            remainderArray.fill(columnCount - row.length)
            return (
              <React.Fragment key={index.toString()}>
                <GridCard
                  item={col}
                  index={index}
                  key={index.toString()}
                  length={menuItems.length}
                  itemNumber={count}
                />
                {count === menuItems.length && row.length < columnCount
                  ? remainderArray.map((item, idx) => (
                      <Column width={windowWidth * 0.27} key={idx.toString()} />
                    ))
                  : null}
              </React.Fragment>
            )
          })}
        </HStack>
      )
    })
  }

  return <>{renderGrid(gridArdray)}</>
}

export default GridView
