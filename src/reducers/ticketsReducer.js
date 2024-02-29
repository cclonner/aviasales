/* eslint-disable indent */
/* eslint-disable default-param-last */
const initialState = {
  tickets: [],
  loading: true,
  error: null,
  filters: {
    stops: {
      all: true,
      nonStop: true,
      oneStop: true,
      twoStops: true,
      threeStops: true,
    },
  },
  sorting: {
    byPrice: false,
    byDuration: true,
    byOptimal: false,
  },
}

const ticketsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_TICKETS_SUCCESS':
      return { ...state, tickets: [...state.tickets, ...action.payload] }

    case 'FETCH_TICKETS_FAILURE':
      return { ...state, error: action.payload }

    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'TOGGLE_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.category]: {
            ...state.filters[action.payload.category],
            ...action.payload.filters,
          },
        },
      }
    case 'TOGGLE_SORT':
      return {
        ...state,
        sorting: {
          byPrice: action.payload === 'byPrice' ? !state.sorting.byPrice : false,
          byDuration: action.payload === 'byDuration' ? !state.sorting.byDuration : false,
          byOptimal: action.payload === 'byOptimal' ? !state.sorting.byOptimal : false,
        },
      }

    default:
      return state
  }
}

export default ticketsReducer
