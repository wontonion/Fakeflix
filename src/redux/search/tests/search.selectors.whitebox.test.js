import { selectSearchResults, selectSearchInputValue } from '../search.selectors';

describe('selectSearchResults selector', () => {
  const sampleResults = [{ id: 1 }, { id: 2 }];
  const stateWithSearch = {
    search: {
      searchResults: sampleResults,
      inputValue: 'foo'
    }
  };
  const stateWithEmptySlice = {
    search: {}
  };

  it('returns searchResults when state is well-formed', () => {
    expect(selectSearchResults(stateWithSearch)).toBe(sampleResults);
  });

  it('is memoized (same input returns same reference)', () => {
    const first = selectSearchResults(stateWithSearch);
    const second = selectSearchResults(stateWithSearch);
    expect(second).toBe(first);
  });

  it('returns empty slice if missing input', () => {
    const first = selectSearchResults(stateWithSearch);
    const second = selectSearchResults();
    expect(second).toEqual(first);
  });

  it('returns empty slice if empty input', () => {
    const first = selectSearchResults(stateWithSearch);
    const second = selectSearchResults({});
    expect(second).toEqual(first);
  });

  it('returns undefined when search slice exists but searchResults is missing', () => {
    expect(selectSearchResults(stateWithEmptySlice)).toBeUndefined();
  });
});

describe('selectSearchInputValue selector', () => {
  const sampleInput = 'foo';
  const stateWithSearch = {
    search: {
      searchResults: [],
      inputValue: sampleInput
    }
  };
  const stateWithEmptySlice = {
    search: {}
  };

  it('returns inputValue when state is well-formed', () => {
    expect(selectSearchInputValue(stateWithSearch)).toBe(sampleInput);
  });

  it('is memoized (same input returns same reference)', () => {
    const first = selectSearchInputValue(stateWithSearch);
    const second = selectSearchInputValue(stateWithSearch);
    expect(second).toBe(first);
  });

  it('returns empty slice if missing input', () => {
    const first = selectSearchInputValue(stateWithSearch);
    const second = selectSearchInputValue();
    expect(second).toEqual(first);
  });

  it('returns empty slice if empty input', () => {
    const first = selectSearchInputValue(stateWithSearch);
    const second = selectSearchInputValue({});
    expect(second).toEqual(first);
  });

  it('returns undefined when search slice exists but inputValue is missing', () => {
    expect(selectSearchInputValue(stateWithEmptySlice)).toBeUndefined();
  });
});
