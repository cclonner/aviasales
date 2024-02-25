const initialState = {
  tickets: [],
  loading: false,
  error: null,
  filters: {
    stops: {
      all: true,
      nonStop: false,
      oneStop: false,
      twoStops: false,
      threeStops: false,
    },
  },
  sorting: {
    byPrice: false,
    byDuration: false,
  },
};

const ticketsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_TICKETS_START':
      return { ...state, loading: true, error: null };

    case 'FETCH_TICKETS_SUCCESS':
      return { ...state, loading: false, tickets: action.payload };

    case 'FETCH_TICKETS_FAILURE':
      return { ...state, loading: false, error: action.payload };

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
      };

    case 'TOGGLE_SORT':
      return {
        ...state,
        sorting: {
          ...state.sorting,
          [action.payload]: !state.sorting[action.payload],
        },
      };

    default:
      return state;
  }
};

export default ticketsReducer;