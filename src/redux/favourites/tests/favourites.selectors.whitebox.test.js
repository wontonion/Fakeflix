import { selectFavouritesList } from '../favourites.selectors';

describe('selectFavouritesList selector', () => {
  const sampleList = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
  const stateWithList = {
    favourites: {
      favouritesList: sampleList
    }
  };
  const stateWithEmptySlice = {
    favourites: {}
  };

  it('returns the favouritesList when state is well-formed', () => {
    expect(selectFavouritesList(stateWithList)).toBe(sampleList);
  });

  it('is memoized (same input returns same reference)', () => {
    const first = selectFavouritesList(stateWithList);
    const second = selectFavouritesList(stateWithList);
    expect(second).toBe(first);
  });

  it('returns empty slice if missing input', () => {
    const first = selectFavouritesList(stateWithList);
    const second = selectFavouritesList();
    expect(second).toEqual(first);
  });

  it('returns empty slice if empty input', () => {
    const first = selectFavouritesList(stateWithList);
    const second = selectFavouritesList({});
    expect(second).toEqual(first);
  });

  it('returns undefined when favourites slice exists but favouritesList is missing', () => {
    expect(selectFavouritesList(stateWithEmptySlice)).toBeUndefined();
  });
});
