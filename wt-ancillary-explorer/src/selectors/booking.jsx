export function getGuestData(state) {
  return state.booking.guest;
}

export function getHotelData(state) {
  return state.booking.hotel;
}

export function getCustomerData(state) {
  return state.booking.customer;
}

export default {
  getGuestData,
  getHotelData,
  getCustomerData,
};
