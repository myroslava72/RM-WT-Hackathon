export function getResults(state) {
  return state.search.results;
}

export function getSortedResults(state, getAncillaryById) {
  return state.search.sortingScores.map(s => Object.assign({}, s, {
    ancillary: getAncillaryById(state, s.id),
  })).filter(s => !!s.ancillary);
}

export default {
  getResults,
  getSortedResults,
};
