import {
  selectCurrentUser,
  selectAuthLoadingState,
  selectAuthErrors
} from '../auth.selectors';

describe('Auth Selectors', () => {
  const dummyUser = { id: 'u1', name: 'Alice' };
  const dummyState = {
    auth: {
      currentUser: dummyUser,
      loading: false,
      error: 'Oops!',
    },
    someOther: { foo: 'bar' },
  };

  describe('selectCurrentUser', () => {
    it('should return currentUser from auth slice', () => {
      expect(selectCurrentUser(dummyState)).toBe(dummyUser);
    });

    it('should be memoized (same input returns same reference)', () => {
      const first = selectCurrentUser(dummyState);
      const second = selectCurrentUser(dummyState);
      expect(second).toBe(first);
    });
  });

  describe('selectAuthLoadingState', () => {
    it('should return loading boolean from auth slice', () => {
      expect(selectAuthLoadingState(dummyState)).toBe(false);
    });
  });

  describe('selectAuthErrors', () => {
    it('should return error string from auth slice', () => {
      expect(selectAuthErrors(dummyState)).toBe('Oops!');
    });
  });

  describe('when auth slice is missing', () => {
    const empty = {};
    it('selectCurrentUser returns undefined', () => {
      expect(selectCurrentUser(empty)).toBeUndefined();
    });
    it('selectAuthLoadingState returns undefined', () => {
      expect(selectAuthLoadingState(empty)).toBeUndefined();
    });
    it('selectAuthErrors returns undefined', () => {
      expect(selectAuthErrors(empty)).toBeUndefined();
    });
  });
});
