import {
  addToFavouritesUtil,
  removeFromFavouritesUtil
} from '../favourites.utils';

describe('addToFavouritesUtil', () => {
  const item1 = { id: 1, name: 'A' };
  const item2 = { id: 2, name: 'B' };

  it('adds an item when not already in the list', () => {
    const list = [item1];
    const result = addToFavouritesUtil(list, item2);
    expect(result).toEqual([item1, item2]);
    expect(list).toEqual([item1]);
  });

  it('does not add a duplicate item', () => {
    const list = [item1];
    const result = addToFavouritesUtil(list, { id: 1, name: 'A' });
    expect(result).toEqual([item1]);
    expect(result).not.toBe(list);
  });

  it('works on an empty list', () => {
    const result = addToFavouritesUtil([], item1);
    expect(result).toEqual([item1]);
  });

  it('does not add if favouritesList is undefined', () => {
    expect(() => addToFavouritesUtil(undefined, item1)).toEqual([]);
  });

  it('does not add if favouriteToAdd is undefined', () => {
    expect(() => addToFavouritesUtil([], undefined)).toEqual([]);
  });
});

describe('removeFromFavouritesUtil', () => {
  const item1 = { id: 1, name: 'A' };
  const item2 = { id: 2, name: 'B' };

  it('removes an existing item', () => {
    const list = [item1, item2];
    const result = removeFromFavouritesUtil(list, item1);
    expect(result).toEqual([item2]);
    expect(list).toEqual([item1, item2]);
  });

  it('does not remove when the item is not in the list', () => {
    const list = [item1];
    const result = removeFromFavouritesUtil(list, item2);
    expect(result).toEqual([item1]);
    expect(result).not.toBe(list);
  });

  it('works on an empty list', () => {
    const result = removeFromFavouritesUtil([], item1);
    expect(result).toEqual([]);
  });

  it('returns empty list if favouritesList is undefined', () => {
    expect(() => removeFromFavouritesUtil(undefined, item1)).toEqual([]);
  });

  it('does not remove if favouriteToRemove is undefined', () => {
    expect(() => removeFromFavouritesUtil([], undefined)).toEqual([]);
  });
});
