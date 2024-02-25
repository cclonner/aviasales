import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const InputCheckbox = ({ value, text }) => {
  const dispatch = useDispatch();
  const stopsFilters = useSelector((state) => state.tickets.filters.stops);

  const handleFilterChange = (filter) => {
    let newFilters;

    if (filter === 'all') {
      newFilters = Object.keys(stopsFilters).reduce((acc, key) => {
        acc[key] = !stopsFilters[filter];
        return acc;
      }, {});
    } else {
      newFilters = { ...stopsFilters, [filter]: !stopsFilters[filter] };
    }

    dispatch({
      type: 'TOGGLE_FILTER',
      payload: { category: 'stops', filters: newFilters },
    });
  };

  return (
    <label>
      <input
        type="checkbox"
        value={value}
        checked={stopsFilters[value]}
        onChange={() => handleFilterChange(value)}
      />
      {text}
    </label>
  );
};

const Filters = () => {
  return (
    <div>
      <InputCheckbox value="all" text="Все" />
      <InputCheckbox value="nonStop" text="без пересадок" />
      <InputCheckbox value="oneStop" text="1 Пересадка" />
      <InputCheckbox value="twoStops" text="2 Пересадки" />
      <InputCheckbox value="threeStops" text="3 Пересадки" />
    </div>
  );
};

export default Filters;
