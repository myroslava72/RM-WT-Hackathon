export function getCurrentByAncillaryId(state, ancillaryId) {
  return state.estimates.current[ancillaryId];
}

export function getCurrent(state) {
  return state.estimates.current;
}

export default {
  getCurrentByAncillaryId,
  getCurrent,
};
