import comedySeriesReducer from '../comedy.reducer';
import { seriesActionTypes } from '../series.types';

describe('comedySeriesReducer', () => {
  const initialState = {
    loading: false,
    error: '',
    data: []
  };

  it('returns initial state when state is undefined', () => {
    expect(comedySeriesReducer(undefined, {})).toEqual(initialState);
  });

  it('handles FETCH_COMEDY_SERIES_REQUEST', () => {
    const action = { type: seriesActionTypes.FETCH_COMEDY_SERIES_REQUEST };
    expect(comedySeriesReducer(initialState, action)).toEqual({
      ...initialState,
      loading: true
    });
  });

  it('handles FETCH_COMEDY_SERIES_SUCCESS', () => {
    const payload = [{ id: 1 }];
    const prevState = { ...initialState, loading: true, error: 'old error' };
    const action = {
      type: seriesActionTypes.FETCH_COMEDY_SERIES_SUCCESS,
      payload
    };
    expect(comedySeriesReducer(prevState, action)).toEqual({
      loading: false,
      error: '',
      data: payload
    });
  });

  it('handles LOAD_MORE_COMEDY_SERIES_SUCCESS', () => {
    const existing = [{ id: 1 }];
    const more = [{ id: 2 }];
    const prevState = { ...initialState, data: existing, loading: true };
    const action = {
      type: seriesActionTypes.LOAD_MORE_COMEDY_SERIES_SUCCESS,
      payload: more
    };
    expect(comedySeriesReducer(prevState, action)).toEqual({
      loading: false,
      error: '',
      data: [...existing, ...more]
    });
  });

  it('handles FETCH_COMEDY_SERIES_FAILURE', () => {
    const prevState = { ...initialState, loading: true, data: [{ id: 1 }] };
    const action = {
      type: seriesActionTypes.FETCH_COMEDY_SERIES_FAILURE,
      payload: 'request failed'
    };
    expect(comedySeriesReducer(prevState, action)).toEqual({
      loading: false,
      error: 'request failed',
      data: []
    });
  });

  it('returns same state for unknown action types', () => {
    const prevState = { loading: false, error: '', data: [{ id: 1 }] };
    expect(
      comedySeriesReducer(prevState, { type: 'UNKNOWN_ACTION' })
    ).toBe(prevState);
  });
});
