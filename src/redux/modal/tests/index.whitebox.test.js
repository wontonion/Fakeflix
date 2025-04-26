import modalReducer from '../index';
import { modalActionTypes } from '../modal.types';

describe('modalReducer', () => {
  const initialState = {
    modalIsClosed: true,
    modalContent: {}
  };

  it('returns initial state when state is undefined', () => {
    expect(modalReducer(undefined, {})).toEqual(initialState);
  });

  it('handles SHOW_MODAL_DETAILS', () => {
    const payload = { id: 1, detail: 'info' };
    const action = {
      type: modalActionTypes.SHOW_MODAL_DETAILS,
      payload
    };
    const newState = modalReducer(initialState, action);
    expect(newState).toEqual({
      modalIsClosed: false,
      modalContent: payload
    });
  });

  it('handles HIDE_MODAL_DETAILS', () => {
    const prevState = {
      modalIsClosed: false,
      modalContent: { id: 1, detail: 'info' }
    };
    const action = { type: modalActionTypes.HIDE_MODAL_DETAILS };
    const newState = modalReducer(prevState, action);
    expect(newState).toEqual({
      modalIsClosed: true,
      modalContent: {}
    });
  });

  it('returns current state for unknown action types', () => {
    const prevState = {
      modalIsClosed: false,
      modalContent: { foo: 'bar' }
    };
    const newState = modalReducer(prevState, { type: 'UNKNOWN' });
    expect(newState).toBe(prevState);
  });
});
