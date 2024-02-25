import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTickets, setError } from '../../actions/ticketActions';
import { getSearchId, getTickets } from '../../services/api';
import TicketList from '../TicketList/TicketList';
import Filters from '../Filters/Filters';

import classes from './App.module.scss'

const App = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.tickets.error);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchId = await getSearchId();
        const { tickets, stop } = await getTickets(searchId);
  
        if (!stop) {
          dispatch({ type: 'FETCH_TICKETS_SUCCESS', payload: tickets });
        }
      } catch (error) {
        dispatch({ type: 'FETCH_TICKETS_FAILURE', payload: error.message });
      }
    };
  
    fetchData();
  }, [dispatch]);

  return (
    <div className={classes.body }>
      {error && <p>Error: {error}</p>}
      <Filters />
      <TicketList />
    </div>
  );
};

export default App;
