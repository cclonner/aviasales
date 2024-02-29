import { useState } from 'react'
import { useDispatch } from 'react-redux'

import styles from './SortButtons.module.scss'

function Button({ type, text, isActive, onClick }) {
  const handleClick = () => {
    onClick(type)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onClick(type)
    }
  }

  return (
    <div
      className={`${styles.sortButton} ${isActive ? styles.active : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      {text}
    </div>
  )
}
function SortButtons() {
  const dispatch = useDispatch()
  const [activeButton, setActiveButton] = useState('byDuration')

  const handleButtonClick = (type) => {
    if (activeButton === type) {
      setActiveButton(null)

      dispatch({
        type: 'TOGGLE_SORT',
        payload: null,
      })
    } else {
      setActiveButton(type)

      dispatch({
        type: 'TOGGLE_SORT',
        payload: type,
      })
    }
  }

  return (
    <div className={styles.sortButtonsContainer}>
      <Button
        type="byDuration"
        text="Самые быстрые"
        isActive={activeButton === 'byDuration'}
        onClick={handleButtonClick}
      />
      <Button type="byPrice" text="Самые дешевые" isActive={activeButton === 'byPrice'} onClick={handleButtonClick} />
      <Button type="byOptimal" text="Оптимальные" isActive={activeButton === 'byOptimal'} onClick={handleButtonClick} />
    </div>
  )
}

export default SortButtons
