import axios from '../../../axiosInstance';
import * as actions from '../series.actions';
import { seriesActionTypes } from '../series.types';

jest.mock('../../../axiosInstance', () => ({
  __esModule: true,
  default: { get: jest.fn() }
}));

describe('Series action creators', () => {
  it('fetchNetflixSeriesRequest returns correct action', () => {
    expect(actions.fetchNetflixSeriesRequest()).toEqual({
      type: seriesActionTypes.FETCH_NETFLIX_SERIES_REQUEST
    });
  });

  it('fetchNetflixSeriesSuccess returns correct FETCH vs LOAD_MORE', () => {
    const data = [{ id: 1 }];
    expect(actions.fetchNetflixSeriesSuccess(data, true)).toEqual({
      type: seriesActionTypes.FETCH_NETFLIX_SERIES_SUCCESS,
      payload: data
    });
    expect(actions.fetchNetflixSeriesSuccess(data, false)).toEqual({
      type: seriesActionTypes.LOAD_MORE_NETFLIX_SERIES_SUCCESS,
      payload: data
    });
  });

  it('fetchNetflixSeriesFailure returns correct action', () => {
    expect(actions.fetchNetflixSeriesFailure('err')).toEqual({
      type: seriesActionTypes.FETCH_NETFLIX_SERIES_FAILURE,
      payload: 'err'
    });
  });
});

describe('Series async thunks', () => {
  const sampleResponse = { results: [{ id: 1, name: 'X' }] };
  const mapped = [{ id: 1, name: 'X', isFavourite: false }];
  const suites = [
    {
      thunk: actions.fetchNetflixSeriesAsync,
      request: actions.fetchNetflixSeriesRequest,
      success: actions.fetchNetflixSeriesSuccess,
      failure: actions.fetchNetflixSeriesFailure
    },
    {
      thunk: actions.fetchActionAdventureSeriesAsync,
      request: actions.fetchActionAdventureSeriesRequest,
      success: actions.fetchActionAdventureSeriesSuccess,
      failure: actions.fetchActionAdventureSeriesFailure
    },
    {
      thunk: actions.fetchAnimationSeriesAsync,
      request: actions.fetchAnimationSeriesRequest,
      success: actions.fetchAnimationSeriesSuccess,
      failure: actions.fetchAnimationSeriesFailure
    },
    {
      thunk: actions.fetchComedySeriesAsync,
      request: actions.fetchComedySeriesRequest,
      success: actions.fetchComedySeriesSuccess,
      failure: actions.fetchComedySeriesFailure
    },
    {
      thunk: actions.fetchCrimeSeriesAsync,
      request: actions.fetchCrimeSeriesRequest,
      success: actions.fetchCrimeSeriesSuccess,
      failure: actions.fetchCrimeSeriesFailure
    },
    {
      thunk: actions.fetchDocumentarySeriesAsync,
      request: actions.fetchDocumentarySeriesRequest,
      success: actions.fetchDocumentarySeriesSuccess,
      failure: actions.fetchDocumentarySeriesFailure
    },
    {
      thunk: actions.fetchFamilySeriesAsync,
      request: actions.fetchFamilySeriesRequest,
      success: actions.fetchFamilySeriesSuccess,
      failure: actions.fetchFamilySeriesFailure
    },
    {
      thunk: actions.fetchKidsSeriesAsync,
      request: actions.fetchKidsSeriesRequest,
      success: actions.fetchKidsSeriesSuccess,
      failure: actions.fetchKidsSeriesFailure
    },
    {
      thunk: actions.fetchSciFiFantasySeriesAsync,
      request: actions.fetchSciFiFantasySeriesRequest,
      success: actions.fetchSciFiFantasySeriesSuccess,
      failure: actions.fetchSciFiFantasySeriesFailure
    },
    {
      thunk: actions.fetchTrendingSeriesAsync,
      request: actions.fetchTrendingSeriesRequest,
      success: actions.fetchTrendingSeriesSuccess,
      failure: actions.fetchTrendingSeriesFailure
    }
  ];

  beforeEach(() => {
    axios.get.mockClear();
  });

  suites.forEach(({ thunk, request, success, failure }) => {
    describe(thunk.name, () => {
      const url = '/test-url';
      let dispatch;

      beforeEach(() => {
        dispatch = jest.fn();
      });

      it('dispatches request then success when isPage=true', async () => {
        const p = Promise.resolve({ data: sampleResponse });
        axios.get.mockReturnValue(p);
        thunk(url, true)(dispatch);
        expect(dispatch).toHaveBeenCalledWith(request());
        await p;
        expect(dispatch).toHaveBeenCalledWith(success(mapped, true));
      });

      it('dispatches request then load‐more when isPage=false', async () => {
        const p = Promise.resolve({ data: sampleResponse });
        axios.get.mockReturnValue(p);
        thunk(url, false)(dispatch);
        expect(dispatch).toHaveBeenCalledWith(request());
        await p;
        expect(dispatch).toHaveBeenCalledWith(success(mapped));
      });

      it('dispatches request then failure on error', async () => {
        const err = new Error('fail');
        const p = Promise.reject(err);
        axios.get.mockReturnValue(p);
        thunk(url, true)(dispatch);
        expect(dispatch).toHaveBeenCalledWith(request());
        await p.catch(() => { });
        expect(dispatch).toHaveBeenCalledWith(failure('fail'));
      });
    });
  });
});
