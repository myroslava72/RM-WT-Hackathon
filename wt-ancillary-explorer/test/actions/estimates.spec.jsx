import dayjs from 'dayjs';
import { recomputeHotelEstimates } from '../../src/actions/estimates';

describe('action.estimates', () => {
  describe('recomputeHotelEstimates', () => {
    let dispatchMock;
    let getStateMock;
    let exampleState;
    let action;

    beforeEach(() => {
      dispatchMock = jest.fn();
      getStateMock = jest.fn();
      exampleState = {
        booking: {
          guest: {
            arrival: '2018-01-03',
            departure: '2018-01-05',
            guests: [{ age: 18 }],
            helpers: {
              arrivalDateDayJs: dayjs('2018-01-03'),
              departureDateDayJs: dayjs('2018-01-05'),
              lengthOfStay: 2,
            },
          },
        },
        hotels: {
          list: [{
            id: '0x933198455e38925bccb4bfe9fb59bac31d00b4d3',
            currency: 'CZK',
            ratePlans: [
              {
                id: 'rpa',
                price: 100,
                roomTypeIds: ['rtb'],
                availableForReservation: {
                  from: '2018-01-01',
                  to: '2020-12-31',
                },
                availableForTravel: {
                  from: '2016-06-01',
                  to: '2020-12-31',
                },
              },
            ],
            roomTypes: [
              { id: 'rta' },
              { id: 'rtb' },
            ],
          }],
        },
      };
      action = recomputeHotelEstimates({ id: '0x933198455e38925bccb4bfe9fb59bac31d00b4d3' });
    });

    it('should dispatch SET_ESTIMATES when everything is there', () => {
      getStateMock.mockReturnValue(exampleState);
      action(dispatchMock, getStateMock);
      expect(dispatchMock.mock.calls.length).toBe(1);
      expect(getStateMock.mock.calls.length).toBe(1);
    });

    it('should not do anything when hotel does not exist', () => {
      exampleState.hotels.list = [];
      getStateMock.mockReturnValue(exampleState);
      action(dispatchMock, getStateMock);
      expect(dispatchMock.mock.calls.length).toBe(0);
      expect(getStateMock.mock.calls.length).toBe(1);
    });

    it('should not do anything when hotel does not have roomTypes', () => {
      exampleState.hotels.list = [{
        id: '0x933198455e38925bccb4bfe9fb59bac31d00b4d3',
        ratePlans: {},
      }];
      getStateMock.mockReturnValue(exampleState);
      action(dispatchMock, getStateMock);
      expect(dispatchMock.mock.calls.length).toBe(0);
      expect(getStateMock.mock.calls.length).toBe(1);
    });

    it('should not do anything when hotel does not have ratePlans', () => {
      exampleState.hotels.list = [{
        id: '0x933198455e38925bccb4bfe9fb59bac31d00b4d3',
        roomTypes: {},
      }];
      getStateMock.mockReturnValue(exampleState);
      action(dispatchMock, getStateMock);
      expect(dispatchMock.mock.calls.length).toBe(0);
      expect(getStateMock.mock.calls.length).toBe(1);
    });

    it('should not do anything when there are no guest data', () => {
      exampleState.booking = {};
      getStateMock.mockReturnValue(exampleState);
      action(dispatchMock, getStateMock);
      expect(dispatchMock.mock.calls.length).toBe(0);
      expect(getStateMock.mock.calls.length).toBe(1);
    });

    it('should not do anything when guests are missing', () => {
      exampleState.booking.guest = {
        arrival: '2018-01-01',
        departure: '2018-04-01',
      };
      getStateMock.mockReturnValue(exampleState);
      action(dispatchMock, getStateMock);
      expect(dispatchMock.mock.calls.length).toBe(0);
      expect(getStateMock.mock.calls.length).toBe(1);
    });

    it('should not do anything when guests are empty', () => {
      exampleState.booking.guest = {
        arrival: '2018-01-01',
        departure: '2018-04-01',
        guests: [],
      };
      getStateMock.mockReturnValue(exampleState);
      action(dispatchMock, getStateMock);
      expect(dispatchMock.mock.calls.length).toBe(0);
      expect(getStateMock.mock.calls.length).toBe(1);
    });

    it('should not do anything when arrival is missing', () => {
      exampleState.booking.guest = {
        departure: '2018-01-01',
        guests: [{ age: 18 }],
      };
      getStateMock.mockReturnValue(exampleState);
      action(dispatchMock, getStateMock);
      expect(dispatchMock.mock.calls.length).toBe(0);
      expect(getStateMock.mock.calls.length).toBe(1);
    });

    it('should not do anything when departure is missing', () => {
      exampleState.booking.guest = {
        arrival: '2018-01-01',
        guests: [{ age: 18 }],
      };
      getStateMock.mockReturnValue(exampleState);
      action(dispatchMock, getStateMock);
      expect(dispatchMock.mock.calls.length).toBe(0);
      expect(getStateMock.mock.calls.length).toBe(1);
    });
  });
});
