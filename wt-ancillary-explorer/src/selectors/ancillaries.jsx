import { createSelector } from 'reselect';

export function getAncillaries(state) {
  return state.ancillaries.list;
}

export function getNextAncillary(state) {
  return state.ancillaries.next;
}

export function areAncillariesInitialized(state) {
  return state.ancillaries.ancillariesInitialized;
}

export function isLoadingMore(state) {
  return state.ancillaries.ancillariesLoading;
}

export const getAncillariesWithName = createSelector(
  getAncillaries,
  ancillaries => ancillaries.filter(h => !!h.name),
);

function getId(state, id) {
  return id;
}

export function makeGetAncillaryById() {
  return createSelector(
    [getAncillaries, getId],
    (ancillaries, id) => ancillaries.find(ancillary => ancillary.id === id),
  );
}

function getIds(state, ids) {
  return ids;
}

export function makeAncillaryFilterByIds() {
  return createSelector(
    [getAncillaries, getIds],
    (ancillaries, ids) => ids.map(id => ancillarys.find(ancillary => ancillary.id === id)),
  );
}


export default {
  getAncillaries,
  getNextAncillary,
  areAncillariesInitialized,
  isLoadingMore,
  getAncillariesWithName,
  makeGetAncillaryById,
  makeAncillaryFilterByIds,
};
