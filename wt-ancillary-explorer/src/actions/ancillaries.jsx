import { availability } from '@windingtree/wt-pricing-algorithms';

import { createActionThunk } from 'redux-thunk-actions';

import {
  HttpError,
  Http404Error,
  HttpBadRequestError,
  HttpInternalServerError,
  HttpBadGatewayError,
  HttpConflictError,
} from '../services/errors';

const LIMIT = 5;
const ERRORED_REFRESH_TIMEOUT = 10 * 1000;

const LIST_FIELDS = [
  'id',
  'name',
  'description',
  'images',
  'bookingUri',
  'currency',
  'category',
];

const DETAIL_FIELDS = [
  'id',
  'name',
  'category',
  'description',
  'location',
  'images',
  'operator',
  'spokenLanguages',
  'bookingUri',
  'contacts',
  'address',
  'Ancillaries',
  'tags',
  'defaultCancellationAmount',
  'cancellationPolicies',
  'roomTypes',
  'currency',
];

export const translateNetworkError = (status, code, message) => {
  if (status === 400) {
    return new HttpBadRequestError(code, message);
  }
  // Consider 422 as a 404
  if (status === 404 || status === 422) {
    return new Http404Error(code, message);
  }
  if (status === 502) {
    return new HttpBadGatewayError(code, message);
  }
  if (status === 500) {
    return new HttpInternalServerError(code, message);
  }

  const e = new HttpError(code, message);
  e.status = status;
  return e;
};

export const fetchAncillariesList = createActionThunk('FETCH_LIST', ({ getState }) => {
  let url = `${window.env.WT_READ_API}/hotels?fields=${LIST_FIELDS.join(',')}&limit=${LIMIT}`;
  const state = getState();
  if (state.ancillaries.next) {
    url = state.ancillaries.next;
  }
  return fetch(url).then((response) => {
    if (response.status > 299) {
      throw translateNetworkError(response.status, 'missingAncillary', 'Cannot get ancillary list!');
    }
    return response.json();
  });
});

export const fetchAncillaryDetail = createActionThunk('FETCH_DETAIL', ({ id }) => {
  const url = `${window.env.WT_READ_API}/hotels/${id}?fields=${DETAIL_FIELDS.join(',')}`;
  return fetch(url).then((response) => {
    if (response.status > 299) {
      throw translateNetworkError(response.status, id, 'Cannot get ancillary detail!');
    }
    if (response.headers.get('x-data-validation-warning')) {
      // Don't show data with warnings for now
      throw new HttpConflictError();
    }
    return response.json();
  });
});

export const eventuallyResolveErroredAncillaries = () => (dispatch, getState) => {
  setTimeout(() => {
    const { ancillaries } = getState();
    const freshErroredAncillaryIds = Object.keys(ancillaries.erroredAncillaries).filter(id => ancillaries.erroredAncillaries[id] === 'fresh');
    if (freshErroredAncillaryIds.length) {
      for (let i = 0; i < freshErroredAncillaryIds.length; i += 1) {
        dispatch({
          type: 'REFETCH_ERRORED_ANCILLARY_STARTED',
          payload: {
            id: freshErroredAncillaryIds[i],
          },
        });
        dispatch(fetchAncillaryDetail({
          id: freshErroredAncillaryIds[i],
          dispatch,
        })).catch(() => {}); // silent catch to prevent error leaking into console
      }
      dispatch(eventuallyResolveErroredAncillaries());
    }
  }, ERRORED_REFRESH_TIMEOUT);
};


export const fetchAncillaryRatePlans = createActionThunk('FETCH_ANCILLARY_RATE_PLANS', ({ id }) => {
  const url = `${window.env.WT_READ_API}/hotels/${id}/ratePlans`;
  return fetch(url)
    .then((response) => {
      if (response.status > 299) {
        throw translateNetworkError(response.status, id, 'Cannot get ancillary rate plans!');
      }
      return response.json();
    })
    .then(data => ({
      data: data.items,
      id,
    }));
});

export const fetchAncillaryAvailability = createActionThunk('FETCH_ANCILLARY_AVAILABILITY', ({ id }) => {
  const url = `${window.env.WT_READ_API}/hotels/${id}/availability`;
  return fetch(url)
    .then((response) => {
      if (response.status > 299) {
        throw translateNetworkError(response.status, id, 'Cannot get ancillary availability!');
      }
      return response.json();
    })
    .then(data => ({
      data: {
        items: availability.indexAvailability(data.items),
        updatedAt: data.updatedAt,
      },
      id,
    }));
});

export const fetchAncillaryRoomTypes = createActionThunk('FETCH_ANCILLARY_ROOM_TYPES', ({ id }) => {
  const url = `${window.env.WT_READ_API}/hotels/${id}/roomTypes`;
  return fetch(url)
    .then((response) => {
      if (response.status > 299) {
        throw translateNetworkError(response.status, id, 'Cannot get ancillary room types!');
      }
      return response.json();
    })
    .then(data => ({
      data: data.items,
      id,
    }));
});

export default {
  fetchAncillariesList,
  fetchAncillaryDetail,
  fetchAncillaryRatePlans,
  fetchAncillaryAvailability,
  fetchAncillaryRoomTypes,
  eventuallyResolveErroredAncillaries,
};
