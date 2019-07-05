const defaultState = {
  global: {},
  ancillaries: {},
  booking: undefined,
  search: undefined,
};

const reducer = (state = defaultState, action) => {
  let modifiedAncillaries;
  let ancillaryMessages;
  switch (action.type) {
    case 'FETCH_DETAIL_FAILED':
      return Object.assign({}, state, {
        global: {
          status: action.payload.status,
          message: action.payload.message,
        },
      });
    case 'FETCH_LIST_FAILED':
      return Object.assign({}, state, {
        global: {
          status: action.payload.status,
          message: action.payload.message,
        },
      });
    case 'FETCH_ANCILLARY_ROOM_TYPES_FAILED':
    case 'FETCH_ANCILLARY_RATE_PLANS_FAILED':
    case 'FETCH_ANCILLARY_AVAILABILITY_FAILED':
      ancillaryMessages = [].concat(state.ancillaries[action.payload.code])
        .concat([action.payload.message])
        .filter(m => !!m);
      return Object.assign({}, state, {
        ancillaries: Object.assign({}, state.ancillaries, {
          [action.payload.code]: ancillaryMessages,
        }),
      });
    case 'FETCH_ANCILLARY_ROOM_TYPES_SUCCEEDED':
    case 'FETCH_ANCILLARY_RATE_PLANS_SUCCEEDED':
    case 'FETCH_ANCILLARY_AVAILABILITY_SUCCEEDED':
      modifiedAncillaries = Object.assign({}, state.ancillaries);
      delete modifiedAncillaries[action.payload.id];
      return state;
    case 'SEND_BOOKING_FAILED':
      return Object.assign({}, state, {
        booking: action.payload.message,
      });
    case 'SEND_BOOKING_STARTED':
    case 'SEND_BOOKING_SUCCEEDED':
      return Object.assign({}, state, {
        booking: undefined,
      });
    case 'SEARCH_ANCILLARIES_FAILED':
      return Object.assign({}, state, {
        search: action.payload.message,
      });
    case 'SEARCH_ANCILLARIES_STARTED':
      return Object.assign({}, state, {
        search: undefined,
      });
    default:
      return state;
  }
};

export default reducer;
