import React from 'react'
import ListCard from './ListCard'
import { useMenuItems } from '~utils/hooks/useMenuItems'

const ListView = () => {
  const { menuItems } = useMenuItems()
  return (
    <>
      {menuItems.map((item, index) => {
        return <ListCard key={index.toString()} item={item} />
      })}
    </>
  )
}

export default ListView
