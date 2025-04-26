import searchReducer from '../index';
import { searchActionTypes } from '../search.types';

describe('searchReducer', () => {
  const initialState = {
    searchResults: [],
    inputValue: '',
    error: null,
    isLoading: false
  };

  it('returns initial state when state is undefined', () => {
    expect(searchReducer(undefined, {})).toEqual(initialState);
  });

  it('handles CHANGE_SEARCH_INPUT_VALUE', () => {
    const action = {
      type: searchActionTypes.CHANGE_SEARCH_INPUT_VALUE,
      payload: 'test'
    };
    const newState = searchReducer(initialState, action);
    expect(newState).toEqual({
      ...initialState,
      inputValue: 'test'
    });
  });

  it('handles CLEAR_SEARCH_INPUT_VALUE', () => {
    const prevState = { ...initialState, inputValue: 'nonempty' };
    const action = { type: searchActionTypes.CLEAR_SEARCH_INPUT_VALUE };
    const newState = searchReducer(prevState, action);
    expect(newState).toEqual({
      ...initialState,
      inputValue: ''
    });
  });

  it('handles FETCH_SEARCH_RESULTS_REQUEST', () => {
    const action = { type: searchActionTypes.FETCH_SEARCH_RESULTS_REQUEST, payload: 'q' };
    const newState = searchReducer(initialState, action);
    expect(newState).toEqual({
      ...initialState,
      isLoading: true
    });
  });

  it('handles FETCH_SEARCH_RESULTS_SUCCESS', () => {
    const results = [{ id: 1 }, { id: 2 }];
    const action = {
      type: searchActionTypes.FETCH_SEARCH_RESULTS_SUCCESS,
      payload: results
    };
    const prevState = { ...initialState, isLoading: true, error: 'err' };
    const newState = searchReducer(prevState, action);
    expect(newState).toEqual({
      ...initialState,
      searchResults: results,
      error: false,
      isLoading: false
    });
  });

  it('handles FETCH_SEARCH_RESULTS_FAILURE', () => {
    const action = {
      type: searchActionTypes.FETCH_SEARCH_RESULTS_FAILURE,
      payload: 'fail'
    };
    const prevState = { ...initialState, isLoading: true, searchResults: [{ id: 3 }] };
    const newState = searchReducer(prevState, action);
    expect(newState).toEqual({
      ...initialState,
      searchResults: [],
      error: 'fail',
      isLoading: false
    });
  });

  it('returns same state for unknown action types', () => {
    const prevState = { ...initialState, inputValue: 'x' };
    const newState = searchReducer(prevState, { type: 'UNKNOWN' });
    expect(newState).toBe(prevState);
  });
});
