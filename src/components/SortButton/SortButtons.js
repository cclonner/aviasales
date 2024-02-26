import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './SortButtons.module.scss';

const Button = ({ type, text, isActive, onClick }) => {
  const handleClick = () => {
    onClick(type);
  };

  return (
    <div
      className={`${styles.sortButton} ${isActive ? styles.active : ''}`}
      onClick={handleClick}
    >
      {text}  
    </div>
  );
}

const SortButtons = () => {
  const dispatch = useDispatch();
  const [activeButton, setActiveButton] = useState('byPrice');

  const handleButtonClick = (type) => {
    if (activeButton === type) {
      setActiveButton(null);
  
      dispatch({
        type: 'TOGGLE_SORT',
        payload: null,
      });
    } else {
      setActiveButton(type);
  
      dispatch({
        type: 'TOGGLE_SORT',
        payload: type,
      });
    }
  };

  return (
    <div className={styles.sortButtonsContainer}>
      <Button type="byPrice" text="Самые дешевые" isActive={activeButton === 'byPrice'} onClick={handleButtonClick} />
      <Button type="byDuration" text="Самые быстрые" isActive={activeButton === 'byDuration'} onClick={handleButtonClick} />
      <Button type="byOptimal" text="Оптимальные" isActive={activeButton === 'byOptimal'} onClick={handleButtonClick} />
    </div>
  );
};

export default SortButtons;
