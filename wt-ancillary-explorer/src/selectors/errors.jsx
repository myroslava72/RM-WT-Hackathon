export function getByAncillaryId(state, ancillaryId) {
  return state.errors.ancillaries[ancillaryId];
}

export function getGlobal(state) {
  return state.errors.global;
}

export function getBooking(state) {
  return state.errors.booking;
}

export function getSearch(state) {
  return state.errors.search;
}

export default {
  getByAncillaryId,
  getGlobal,
  getBooking,
  getSearch,
};
