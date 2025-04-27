import documentarySeriesReducer from '../documentary.reducer';
import { seriesActionTypes } from '../series.types';

describe('documentarySeriesReducer', () => {
  const initialState = {
    loading: false,
    error: '',
    data: []
  };

  it('returns initial state when state is undefined', () => {
    expect(documentarySeriesReducer(undefined, {})).toEqual(initialState);
  });

  it('handles FETCH_DOCUMENTARY_SERIES_REQUEST', () => {
    const action = { type: seriesActionTypes.FETCH_DOCUMENTARY_SERIES_REQUEST };
    expect(documentarySeriesReducer(initialState, action)).toEqual({
      ...initialState,
      loading: true
    });
  });

  it('handles FETCH_DOCUMENTARY_SERIES_SUCCESS', () => {
    const payload = [{ id: 1 }];
    const prevState = { ...initialState, loading: true, error: 'old error' };
    const action = {
      type: seriesActionTypes.FETCH_DOCUMENTARY_SERIES_SUCCESS,
      payload
    };
    expect(documentarySeriesReducer(prevState, action)).toEqual({
      loading: false,
      error: '',
      data: payload
    });
  });

  it('handles LOAD_MORE_DOCUMENTARY_SERIES_SUCCESS', () => {
    const existing = [{ id: 1 }];
    const more = [{ id: 2 }];
    const prevState = { ...initialState, data: existing, loading: true };
    const action = {
      type: seriesActionTypes.LOAD_MORE_DOCUMENTARY_SERIES_SUCCESS,
      payload: more
    };
    expect(documentarySeriesReducer(prevState, action)).toEqual({
      loading: false,
      error: '',
      data: [...existing, ...more]
    });
  });

  it('handles FETCH_DOCUMENTARY_SERIES_FAILURE', () => {
    const prevState = { ...initialState, loading: true, data: [{ id: 1 }] };
    const action = {
      type: seriesActionTypes.FETCH_DOCUMENTARY_SERIES_FAILURE,
      payload: 'request failed'
    };
    expect(documentarySeriesReducer(prevState, action)).toEqual({
      loading: false,
      error: 'request failed',
      data: []
    });
  });

  it('returns same state for unknown action types', () => {
    const prevState = { loading: false, error: '', data: [{ id: 1 }] };
    expect(
      documentarySeriesReducer(prevState, { type: 'UNKNOWN_ACTION' })
    ).toBe(prevState);
  });
});
