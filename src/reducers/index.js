import { combineReducers } from 'redux';
import ticketReducer from './ticketReducer';

const rootReducer = combineReducers({
  tickets: ticketReducer,
});

export default rootReducer;