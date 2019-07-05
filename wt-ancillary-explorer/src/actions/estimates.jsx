import dayjs from 'dayjs';
import { prices, availability } from '@windingtree/wt-pricing-algorithms';
import { fetchAncillaryRatePlans, fetchAncillaryRoomTypes, fetchAncillaryAvailability } from './ancillaries';

export const recomputeAncillaryEstimates = ({ id }) => (dispatch, getState) => {
  const state = getState();
  const ancillary = state.ancillaries.list.find(h => h.id === id);
  if (!ancillary) {
    return;
  }
  if (!ancillary.roomTypes || !ancillary.ratePlans) {
    return;
  }
  const { guest: guestData } = state.booking;
  if (
    !guestData
    || !guestData.arrival
    || !guestData.departure
    || !guestData.guests
    || !guestData.guests.length
  ) {
    return;
  }

  const computer = new prices.PriceComputer(
    ancillary.roomTypes,
    ancillary.ratePlans,
    ancillary.currency,
  );

  const pricingEstimates = computer.getBestPrice(
    dayjs(),
    guestData.helpers.arrivalDateDayjs,
    guestData.helpers.departureDateDayjs,
    guestData.guests,
  ).map((pe) => {
    if (!pe.prices || !pe.prices.length) {
      return pe;
    }
    return Object.assign(pe, {
      // This might not work that easily for other pricing strategies
      currency: pe.prices[0].currency,
      price: pe.prices[0].total,
    });
  });

  const quantities = ancillary.availability && ancillary.availability.items
    ? availability.computeAvailability(
      guestData.arrival,
      guestData.departure,
      guestData.guests.length,
      ancillary.roomTypes,
      ancillary.availability.items,
    ) : [];
  dispatch({
    type: 'SET_ESTIMATES',
    payload: {
      id,
      data: pricingEstimates.map((pd) => {
        const quantityWrapper = quantities.find(q => q.roomTypeId === pd.id);
        return Object.assign({}, pd, {
          quantity: quantityWrapper ? quantityWrapper.quantity : undefined,
        });
      }),
    },
  });
};

export const fetchAndComputeAncillaryEstimates = ({
  id, ratePlans, roomTypes, availabilityData,
}) => (dispatch) => {
  let ratePlansPromise;
  let roomTypesPromise;
  let availabilityPromise;
  // Do not hit ancillaries with rate plans already downloaded
  if (ratePlans) {
    ratePlansPromise = Promise.resolve();
  } else {
    // silent catch, the errors are dealt with in appropriate reducers
    ratePlansPromise = dispatch(fetchAncillaryRatePlans({ id })).catch(() => {});
  }
  // Do not hit ancillaries with room types already downloaded
  if (roomTypes) {
    roomTypesPromise = Promise.resolve();
  } else {
    // silent catch, the errors are dealt with in appropriate reducers
    roomTypesPromise = dispatch(fetchAncillaryRoomTypes({ id })).catch(() => {});
  }
  // Do not hit ancillaries with availability already downloaded
  if (availabilityData) {
    availabilityPromise = Promise.resolve();
  } else {
    // silent catch, the errors are dealt with in appropriate reducers
    availabilityPromise = dispatch(fetchAncillaryAvailability({ id })).catch(() => {});
  }
  // for each ancillary in parallel get rate plan, room types, availability and recompute estimates
  return Promise.all([ratePlansPromise, roomTypesPromise, availabilityPromise])
    .then(() => dispatch(recomputeAncillaryEstimates({ id })));
};

export const recomputeAllPrices = ({
  _formActions,
}) => (dispatch, getState) => {
  // Collect all rate plans
  const state = getState();
  const ratePlansPromises = state.ancillaries.list.map(h => dispatch(fetchAndComputeAncillaryEstimates(h)));
  // Wait for everything and enable form resubmission
  Promise.all(ratePlansPromises).then(() => {
    _formActions.setSubmitting(false);
  });
};

export default {
  recomputeAllPrices,
  recomputeAncillaryEstimates,
  fetchAndComputeAncillaryEstimates,
};
