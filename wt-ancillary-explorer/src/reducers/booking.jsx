import dayjs from 'dayjs';

const baseDate = dayjs().day() <= 3 ? dayjs() : dayjs().set('day', 0).add(7, 'days');
const defaultArrival = dayjs(baseDate).set('day', 5).startOf('day');
const defaultDeparture = dayjs(baseDate).set('day', 7).startOf('day');


const defaultState = {
  guest: {
    arrival: defaultArrival.format('YYYY-MM-DD'),
    departure: defaultDeparture.format('YYYY-MM-DD'),
    guests: [],
    helpers: {
      numberOfGuests: 0,
      lengthOfStay: defaultDeparture.diff(defaultArrival, 'days'),
      arrivalDateDayjs: defaultArrival,
      departureDateDayjs: defaultDeparture,
    },
  },
  customer: {},
  ancillary: {}, // rooms, cancellationFees
};

const reducer = (state = defaultState, action) => {
  let arrivalDateDayjs;
  let departureDateDayjs;
  let updatedHotel;
  let guests;
  switch (action.type) {
    case 'SET_STAY_DATA':
      arrivalDateDayjs = dayjs(action.payload.arrival);
      departureDateDayjs = dayjs(action.payload.departure);
      return Object.assign({}, state, {
        guest: Object.assign({}, state.guest, {
          arrival: action.payload.arrival,
          departure: action.payload.departure,
          helpers: Object.assign({}, state.guest.helpers, {
            lengthOfStay: departureDateDayjs.diff(arrivalDateDayjs, 'days'),
            arrivalDateDayjs,
            departureDateDayjs,
          }),
        }),
      });
    case 'SET_GUEST_DATA':
      guests = action.payload.guests ? action.payload.guests.map((g, i) => Object.assign({ name: '', surname: '', age: 0 }, g, { id: `guest-${i}` })) : [];
      return Object.assign({}, state, {
        guest: Object.assign({}, state.guest, {
          guests,
          helpers: Object.assign({}, state.guest.helpers, {
            numberOfGuests: guests.length,
          }),
        }),
      });
    case 'SET_CUSTOMER':
      return Object.assign({}, state, {
        customer: action.payload.customer,
      });
    case 'ADD_ROOM_TYPE':
      updatedHotel = state.hotel && state.hotel.id === action.payload.hotelId ? state.hotel : {
        id: action.payload.hotelId,
        rooms: [],
        cancellationFees: [],
      };
      updatedHotel.rooms = [{
        id: action.payload.roomTypeId,
        guestInfoIds: [],
      }];
      return Object.assign({}, state, {
        hotel: updatedHotel,
        customer: Object.assign({}, state.customer, {
          lastBookingId: undefined,
          lastBookingStatus: undefined,
        }),
      });
    case 'SET_CANCELLATION_FEES':
      updatedHotel = state.hotel && state.hotel.id === action.payload.hotelId ? state.hotel : {
        id: action.payload.hotelId,
        rooms: [],
        cancellationFees: [],
      };
      return Object.assign({}, state, {
        hotel: Object.assign({}, updatedHotel, {
          cancellationFees: action.payload.fees,
        }),
      });
    case 'SEND_BOOKING_SUCCEEDED':
      return Object.assign({}, state, {
        customer: Object.assign({}, state.customer, {
          lastBookingId: action.payload.id,
          lastBookingStatus: action.payload.status,
        }),
      });
    default:
      return state;
  }
};

export default reducer;
