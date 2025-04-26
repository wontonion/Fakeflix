import axios from '../../../axiosInstance';
import requests from '../../../requests';
import {
  changeSearchInputValue,
  clearSearchInputValue,
  fetchSearchResultsRequest,
  fetchSearchResultsSuccess,
  fetchSearchResultsFailure,
  fetchSearchResultsAsync
} from '../search.actions';
import { searchActionTypes } from '../search.types';

jest.mock('../../../axiosInstance', () => ({
  __esModule: true,
  default: { get: jest.fn() }
}));

describe('Search action creators', () => {
  it('changeSearchInputValue returns correct action', () => {
    const input = 'hello';
    expect(changeSearchInputValue(input)).toEqual({
      type: searchActionTypes.CHANGE_SEARCH_INPUT_VALUE,
      payload: input
    });
  });

  it('clearSearchInputValue returns correct action', () => {
    expect(clearSearchInputValue()).toEqual({
      type: searchActionTypes.CLEAR_SEARCH_INPUT_VALUE
    });
  });

  it('fetchSearchResultsRequest returns correct action', () => {
    const q = 'query';
    expect(fetchSearchResultsRequest(q)).toEqual({
      type: searchActionTypes.FETCH_SEARCH_RESULTS_REQUEST,
      payload: q
    });
  });

  it('fetchSearchResultsSuccess returns correct action', () => {
    const results = [{ id: 1 }];
    expect(fetchSearchResultsSuccess(results)).toEqual({
      type: searchActionTypes.FETCH_SEARCH_RESULTS_SUCCESS,
      payload: results
    });
  });

  it('fetchSearchResultsFailure returns correct action', () => {
    const err = 'error';
    expect(fetchSearchResultsFailure(err)).toEqual({
      type: searchActionTypes.FETCH_SEARCH_RESULTS_FAILURE,
      payload: err
    });
  });
});

describe('fetchSearchResultsAsync thunk', () => {
  const dispatch = jest.fn();
  const query = 'test';
  const url = `${requests.fetchSearchQuery}${query}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches request and then success with filtered results', async () => {
    const apiResults = [
      { id: 1, media_type: 'movie' },
      { id: 2, media_type: 'person' },
      { id: 3, media_type: 'tv' }
    ];
    const filtered = [
      { id: 1, media_type: 'movie' },
      { id: 3, media_type: 'tv' }
    ];
    const promise = Promise.resolve({ data: { results: apiResults } });
    axios.get.mockReturnValue(promise);

    fetchSearchResultsAsync(query)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(fetchSearchResultsRequest(query));
    expect(axios.get).toHaveBeenCalledWith(url);

    await promise;
    expect(dispatch).toHaveBeenCalledWith(fetchSearchResultsSuccess(filtered));
  });

  it('dispatches request and then failure on error', async () => {
    const err = new Error('network fail');
    const promise = Promise.reject(err);
    axios.get.mockReturnValue(promise);

    fetchSearchResultsAsync(query)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(fetchSearchResultsRequest(query));
    expect(axios.get).toHaveBeenCalledWith(url);

    await promise.catch(() => {});

    expect(dispatch).toHaveBeenCalledWith(fetchSearchResultsFailure(err.message));
  });
});
