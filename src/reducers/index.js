import { combineReducers } from 'redux'

import ticketReducer from './ticketsReducer'

const rootReducer = combineReducers({
  tickets: ticketReducer,
})

export default rootReducer
