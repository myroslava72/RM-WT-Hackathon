const defaultState = {
  erroredAncillaries: {},
  list: [],
  ancillariesInitialized: false,
  ancillariesLoading: false,
  next: null,
};

const remapErroredIds = list => list
  .map(e => e.data && e.data.id)
  .filter(h => !!h)
  .reduce((agg, cur) => {
    if (agg[cur]) {
      return agg;
    }
    return Object.assign({}, agg, {
      [cur]: 'fresh',
    });
  }, {});

const reducer = (state = defaultState, action) => {
  let modifiedList;
  let existingIds;
  let currentErroredAncillaries;
  let ancillary;
  let ancillaryIndex;
  switch (action.type) {
    case 'REFETCH_ERRORED_ANCILLARY_STARTED':
      currentErroredAncillaries = Object.assign({}, state.erroredAncillaries);
      if (currentErroredAncillaries[action.payload.id]) {
        currentErroredAncillaries[action.payload.id] = 'in-progress';
      }
      return Object.assign({}, state, {
        erroredAncillaries: currentErroredAncillaries,
      });
    case 'FETCH_LIST_STARTED':
      return Object.assign({}, state, {
        ancillariesLoading: true,
      });
    // cache ancillaries returned with search query for later use
    case 'SEARCH_ANCILLARIES_SUCCEEDED':
      modifiedList = [...state.list];
      existingIds = state.list.reduce((acc, h, i) => {
        acc[h.id] = i;
        return acc;
      }, {});
      for (let i = 0; i < action.payload.items.length; i += 1) {
        if (existingIds[action.payload.items[i].id] !== undefined) {
          modifiedList[existingIds[action.payload.items[i].id]] = Object.assign({},
            modifiedList[existingIds[action.payload.items[i].id]],
            action.payload.items[i],
            {
              roomTypes: action.payload.items[i].roomTypes,
            });
        } else {
          modifiedList.push(Object.assign({}, action.payload.items[i], {
            hasDetailLoaded: false,
            hasDetailLoading: false,
            roomTypes: action.payload.items[i].roomTypes,
          }));
        }
      }
      return Object.assign({}, state, {
        list: modifiedList,
        ancillariesLoading: false,
        ancillariesInitialized: false,
      });

    case 'FETCH_LIST_SUCCEEDED':
      if (!action.payload.items) {
        if (action.payload.errors) {
          currentErroredAncillaries = remapErroredIds(action.payload.errors);
          return Object.assign({}, state, {
            erroredAncillaries: Object.assign({}, state.erroredAncillaries, currentErroredAncillaries),
          });
        }
        return state;
      }

      if (action.payload.errors) {
        currentErroredAncillaries = Object.assign({},
          state.erroredAncillaries,
          remapErroredIds(action.payload.errors));
      } else {
        currentErroredAncillaries = Object.assign({}, state.erroredAncillaries);
      }

      modifiedList = [...state.list];
      existingIds = state.list.reduce((acc, h, i) => {
        acc[h.id] = i;
        return acc;
      }, {});
      for (let i = 0; i < action.payload.items.length; i += 1) {
        if (existingIds[action.payload.items[i].id] !== undefined) {
          modifiedList[existingIds[action.payload.items[i].id]] = Object.assign({},
            modifiedList[existingIds[action.payload.items[i].id]],
            action.payload.items[i],
            {
              roomTypes: action.payload.items[i].roomTypes,
            });
        } else {
          modifiedList.push(Object.assign({}, action.payload.items[i], {
            hasDetailLoaded: false,
            hasDetailLoading: false,
            roomTypes: action.payload.items[i].roomTypes,
          }));
        }
        // Drop successfully refreshed ancillary from errored
        if (currentErroredAncillaries[action.payload.items[i].id]) {
          delete currentErroredAncillaries[action.payload.items[i].id];
        }
      }
      return Object.assign({}, state, {
        erroredAncillaries: currentErroredAncillaries,
        list: modifiedList,
        ancillariesLoading: false,
        ancillariesInitialized: true,
        next: action.payload.next,
      });
    case 'FETCH_DETAIL_STARTED':
      modifiedList = [].concat(state.list);
      ancillary = modifiedList.find(h => h.id === action.payload[0].id);
      if (!ancillary) {
        ancillary = {
          id: action.payload[0].id,
        };
        modifiedList.push(ancillary);
      }
      ancillaryIndex = modifiedList.indexOf(ancillary);
      ancillary.hasDetailLoaded = false;
      ancillary.hasDetailLoading = true;
      modifiedList[ancillaryIndex] = ancillary;
      return Object.assign({}, state, {
        list: modifiedList,
      });
    case 'FETCH_DETAIL_SUCCEEDED':
      modifiedList = [].concat(state.list);
      ancillary = modifiedList.find(h => h.id === action.payload.id);
      if (!ancillary) {
        return state;
      }
      ancillaryIndex = modifiedList.indexOf(ancillary);
      ancillary = Object.assign(
        {},
        ancillary,
        action.payload,
        {
          roomTypes: action.payload.roomTypes,
        },
      );
      ancillary.hasDetailLoaded = true;
      ancillary.hasDetailLoading = false;
      modifiedList[ancillaryIndex] = ancillary;
      currentErroredAncillaries = Object.assign({}, state.erroredAncillaries);

      // Drop successfully refreshed ancillary from errored
      if (currentErroredAncillaries[action.payload.id]) {
        delete currentErroredAncillaries[action.payload.id];
      }

      return Object.assign({}, state, {
        list: modifiedList,
        erroredAncillaries: currentErroredAncillaries,
      });
    case 'FETCH_DETAIL_FAILED':
      modifiedList = state.list.filter(h => h.id !== action.payload.code);
      currentErroredAncillaries = Object.assign({}, state.erroredAncillaries);
      // No other HTTP status gets queued, these are the only states we might
      // potentially recover from
      if (action.payload.status > 499) {
        currentErroredAncillaries[action.payload.code] = 'fresh';
      }
      return Object.assign({}, state, {
        erroredAncillaries: currentErroredAncillaries,
        list: modifiedList,
      });
    case 'FETCH_ANCILLARY_ROOM_TYPES_SUCCEEDED':
      modifiedList = [].concat(state.list);
      ancillary = modifiedList.find(h => h.id === action.payload.id);
      if (!ancillary) {
        return state;
      }
      ancillaryIndex = modifiedList.indexOf(ancillary);
      ancillary = Object.assign({}, ancillary, {
        roomTypes: action.payload.data,
      });
      modifiedList[ancillaryIndex] = ancillary;
      return Object.assign({}, state, {
        list: modifiedList,
      });
    case 'FETCH_ANCILLARY_RATE_PLANS_SUCCEEDED':
      modifiedList = [].concat(state.list);
      ancillary = modifiedList.find(h => h.id === action.payload.id);
      if (!ancillary) {
        return state;
      }
      ancillaryIndex = modifiedList.indexOf(ancillary);
      ancillary = Object.assign({}, ancillary, {
        ratePlans: action.payload.data,
      });
      modifiedList[ancillaryIndex] = ancillary;
      return Object.assign({}, state, {
        list: modifiedList,
      });
    case 'FETCH_ANCILLARY_AVAILABILITY_SUCCEEDED':
      modifiedList = [].concat(state.list);
      ancillary = modifiedList.find(h => h.id === action.payload.id);
      if (!ancillary) {
        return state;
      }
      ancillaryIndex = modifiedList.indexOf(ancillary);
      ancillary = Object.assign({}, ancillary, {
        availability: action.payload.data,
      });
      modifiedList[ancillaryIndex] = ancillary;
      return Object.assign({}, state, {
        list: modifiedList,
      });
    default:
      return state;
  }
};

export default reducer;
