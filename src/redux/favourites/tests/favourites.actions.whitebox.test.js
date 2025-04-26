import {
  addToFavourites,
  removeFromFavourites
} from '../favourites.actions';
import { favouritesActionTypes } from '../favourites.types';

describe('favourites action creators', () => {
  const item = { id: 42, name: 'My Item' };

  describe('addToFavourites', () => {
    it('should create an action to add an item to favourites', () => {
      const expected = {
        type: favouritesActionTypes.ADD_TO_FAVOURITES,
        payload: { id: 42, name: 'My Item', isFavourite: true }
      };
      expect(addToFavourites(item)).toEqual(expected);
    });

    it('should throw when called with undefined', () => {
      expect(() => addToFavourites()).toThrow(TypeError);
    });
  });

  describe('removeFromFavourites', () => {
    it('should create an action to remove an item from favourites', () => {
      const initial = { id: 7, name: 'Other', isFavourite: true };
      const expected = {
        type: favouritesActionTypes.REMOVE_FROM_FAVOURITES,
        payload: { id: 7, name: 'Other', isFavourite: false }
      };
      expect(removeFromFavourites(initial)).toEqual(expected);
    });

    it('should throw when called with undefined', () => {
      expect(() => removeFromFavourites()).toThrow(TypeError);
    });
  });
});
