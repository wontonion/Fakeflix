import favouritesReducer from '../index';
import { favouritesActionTypes } from '../favourites.types';

describe('favouritesReducer', () => {
  const initialState = { favouritesList: [] };

  it('returns initial state when state is undefined', () => {
    expect(favouritesReducer(undefined, {})).toEqual(initialState);
  });

  it('returns the same state object for unknown action types', () => {
    const prevState = { favouritesList: [{ id: 1 }] };
    const newState = favouritesReducer(prevState, { type: 'UNKNOWN' });
    expect(newState).toBe(prevState);
  });

  it('adds an item on ADD_TO_FAVOURITES', () => {
    const item = { id: 1 };
    const action = { type: favouritesActionTypes.ADD_TO_FAVOURITES, payload: item };
    const newState = favouritesReducer(initialState, action);
    expect(newState.favouritesList).toEqual([item]);
    expect(newState).not.toBe(initialState);
  });

  it('does not duplicate an existing item on ADD_TO_FAVOURITES', () => {
    const item = { id: 1 };
    const stateWithItem = { favouritesList: [item] };
    const action = { type: favouritesActionTypes.ADD_TO_FAVOURITES, payload: item };
    const newState = favouritesReducer(stateWithItem, action);
    expect(newState.favouritesList).toEqual([item]);
    expect(newState).not.toBe(stateWithItem);
  });

  it('removes an existing item on REMOVE_FROM_FAVOURITES', () => {
    const item = { id: 1 };
    const stateWithItem = { favouritesList: [item] };
    const action = { type: favouritesActionTypes.REMOVE_FROM_FAVOURITES, payload: item };
    const newState = favouritesReducer(stateWithItem, action);
    expect(newState.favouritesList).toEqual([]);
    expect(newState).not.toBe(stateWithItem);
  });

  it('leaves list empty on REMOVE_FROM_FAVOURITES when item not present', () => {
    const item = { id: 1 };
    const stateEmpty = { favouritesList: [] };
    const action = { type: favouritesActionTypes.REMOVE_FROM_FAVOURITES, payload: item };
    const newState = favouritesReducer(stateEmpty, action);
    expect(newState.favouritesList).toEqual([]);
    expect(newState).not.toBe(stateEmpty);
  });
});
