export const setTickets = (tickets) => ({
    type: 'SET_TICKETS',
    payload: tickets,
  });
  
  export const setError = (error) => ({
    type: 'SET_ERROR',
    payload: error,
  });