import { call, put, takeLatest, all } from 'redux-saga/effects';
import { authActionTypes } from '../auth.types';
import {
  getSnapshotFromUserAuth,
  signInWithGoogle,
  signInWithEmail,
  signInAnonymously,
  checkIfUserIsAuthenticated,
  signOut,
  signUp,
  signInAfterSignUp,
  onCheckUserSession,
  onGoogleSignInStart,
  onEmailSignInStart,
  onAnonymousSignInStart,
  onSignOutStart,
  onSignUpStart,
  onSignUpSuccess,
  authSagas
} from '../auth.sagas';
import {
  signInSuccess,
  signInFailure,
  signOutSuccess,
  signOutFailure,
  signUpSuccess,
  signUpFailure
} from '../auth.actions';

import {
  auth,
  googleProvider,
  createUserProfileDocument,
  getCurrentUser
} from '../../../firebase/firebaseUtils';

jest.mock('../../../firebase/firebaseUtils', () => {
  // const mockUserRef = { get: jest.fn() };
  return {
    __esModule: true,
    auth: {
      signInWithPopup: jest.fn(),
      signInWithEmailAndPassword: jest.fn(),
      signInAnonymously: jest.fn(),
      signOut: jest.fn(),
      createUserWithEmailAndPassword: jest.fn(),
    },
    googleProvider: 'MOCK_GOOGLE_PROVIDER',
    createUserProfileDocument: jest.fn(),
    getCurrentUser: jest.fn(),
  };
});

describe('Auth sagas', () => {
  const userAuth = { uid: '123' };
  const additionalData = { displayName: 'Test User' };
  const mockUserRef = { get: jest.fn() };
  const userSnapshot = { id: '123', data: () => ({ foo: 'bar' }) };
  const error = new Error('Something went wrong');

  describe('getSnapshotFromUserAuth', () => {
    const gen = getSnapshotFromUserAuth(userAuth, additionalData);

    it('calls createUserProfileDocument with userAuth and additionalData', () => {
      expect(gen.next().value).toEqual(
        call(createUserProfileDocument, userAuth, additionalData)
      );
    });

    it('calls userRef.get() and yields its result', () => {
      mockUserRef.get.mockReturnValue(userSnapshot);
      const yielded = gen.next(mockUserRef).value;
      expect(mockUserRef.get).toHaveBeenCalled();
      expect(yielded).toBe(userSnapshot);
    });

    it('puts signInSuccess with id and data', () => {
      expect(gen.next(userSnapshot).value).toEqual(
        put(signInSuccess({ id: '123', foo: 'bar' }))
      );
    });

    it('completes successfully', () => {
      expect(gen.next().done).toBe(true);
    });

    it('on error, puts signInFailure', () => {
      const genErr = getSnapshotFromUserAuth(userAuth, additionalData);
      genErr.next();
      genErr.next(mockUserRef);
      expect(genErr.throw(error).value).toEqual(
        put(signInFailure(error.message))
      );
    });
  });

  describe('signInWithGoogle', () => {
    const fakeResult = { user: 'googleUser' };
    const gen = signInWithGoogle();

    it('yields auth.signInWithPopup', () => {
      expect(gen.next().value).toEqual(
        auth.signInWithPopup(googleProvider)
      );
    });

    it('yields getSnapshotFromUserAuth on success', () => {
      expect(gen.next(fakeResult).value).toEqual(
        getSnapshotFromUserAuth('googleUser')
      );
    });

    it('handles errors by putting signInFailure', () => {
      const genErr = signInWithGoogle();
      genErr.next();
      expect(genErr.throw(error).value).toEqual(
        put(signInFailure(error.message))
      );
    });
  });

  describe('signInWithEmail', () => {
    const action = { payload: { email: 'a@b.com', password: 'pass' } };
    const fakeResult = { user: 'emailUser' };
    const gen = signInWithEmail(action);

    it('yields auth.signInWithEmailAndPassword', () => {
      expect(gen.next().value).toEqual(
        auth.signInWithEmailAndPassword('a@b.com', 'pass')
      );
    });

    it('yields getSnapshotFromUserAuth on success', () => {
      expect(gen.next(fakeResult).value).toEqual(
        getSnapshotFromUserAuth('emailUser')
      );
    });

    it('handles errors', () => {
      const genErr = signInWithEmail(action);
      genErr.next();
      expect(genErr.throw(error).value).toEqual(
        put(signInFailure(error.message))
      );
    });
  });

  describe('signInAnonymously', () => {
    const fakeResult = { user: 'anonUser' };
    const gen = signInAnonymously();

    it('yields auth.signInAnonymously', () => {
      expect(gen.next().value).toEqual(
        auth.signInAnonymously()
      );
    });

    it('yields getSnapshotFromUserAuth on success', () => {
      expect(gen.next(fakeResult).value).toEqual(
        getSnapshotFromUserAuth('anonUser')
      );
    });

    it('handles errors', () => {
      const genErr = signInAnonymously();
      genErr.next();
      expect(genErr.throw(error).value).toEqual(
        put(signInFailure(error.message))
      );
    });
  });

  describe('checkIfUserIsAuthenticated', () => {
    it('yields the result of getCurrentUser and exits early if it returns null', () => {
      getCurrentUser.mockReturnValue(null);
      const gen = checkIfUserIsAuthenticated();
      expect(gen.next().value).toBe(null);
      expect(gen.next().done).toBe(true);
      expect(getCurrentUser).toHaveBeenCalled();
    });

    it('calls getSnapshotFromUserAuth when getCurrentUser returns a user', () => {
      getCurrentUser.mockReturnValue(userAuth);
      const gen = checkIfUserIsAuthenticated();
      expect(gen.next().value).toBe(userAuth);
      gen.next(userAuth);
      expect(gen.next().done).toBe(true);
    });
    
    it('dispatches signInFailure when getCurrentUser throws', () => {
      const error = new Error('auth failed');
      const gen = checkIfUserIsAuthenticated();
      gen.next();
      const effect = gen.throw(error).value;
      expect(effect).toEqual(put(signInFailure(error.message)));
      expect(gen.next().done).toBe(true);
    });
  });

  describe('signOut', () => {
    const gen = signOut();

    it('calls auth.signOut', () => {
      expect(gen.next().value).toEqual(auth.signOut());
    });

    it('puts signOutSuccess', () => {
      expect(gen.next().value).toEqual(put(signOutSuccess()));
    });

    it('handles errors', () => {
      const genErr = signOut();
      genErr.next();
      expect(genErr.throw(error).value).toEqual(
        put(signOutFailure(error.message))
      );
    });
  });

  describe('signUp', () => {
    const action = { payload: { displayName: 'Name', email: 'x@y.com', password: 'pwd' } };
    const fakeResult = { user: 'newUser' };
    const gen = signUp(action);

    it('calls createUserWithEmailAndPassword', () => {
      expect(gen.next().value).toEqual(
        auth.createUserWithEmailAndPassword('x@y.com', 'pwd')
      );
    });

    it('puts signUpSuccess', () => {
      expect(gen.next(fakeResult).value).toEqual(
        put(signUpSuccess({ user: 'newUser', additionalData: { displayName: 'Name' } }))
      );
    });

    it('handles errors', () => {
      const genErr = signUp(action);
      genErr.next();
      expect(genErr.throw(error).value).toEqual(
        put(signUpFailure(error.message))
      );
    });
  });

  describe('signInAfterSignUp', () => {
    const action = { payload: { user: 'u', additionalData: 'ad' } };
    const gen = signInAfterSignUp(action);

    it('yields getSnapshotFromUserAuth', () => {
      expect(gen.next().value).toEqual(
        getSnapshotFromUserAuth('u', 'ad')
      );
    });

    it('completes', () => {
      expect(gen.next().done).toBe(true);
    });
  });

  describe('watcher sagas', () => {
    it('onCheckUserSession watches CHECK_USER_SESSION', () => {
      const gen = onCheckUserSession();
      expect(gen.next().value).toEqual(
        takeLatest(authActionTypes.CHECK_USER_SESSION, checkIfUserIsAuthenticated)
      );
    });

    it('onGoogleSignInStart watches GOOGLE_SIGN_IN_START', () => {
      const gen = onGoogleSignInStart();
      expect(gen.next().value).toEqual(
        takeLatest(authActionTypes.GOOGLE_SIGN_IN_START, signInWithGoogle)
      );
    });

    it('onEmailSignInStart watches EMAIL_SIGN_IN_START', () => {
      const gen = onEmailSignInStart();
      expect(gen.next().value).toEqual(
        takeLatest(authActionTypes.EMAIL_SIGN_IN_START, signInWithEmail)
      );
    });

    it('onAnonymousSignInStart watches ANONYMOUS_SIGN_IN_START', () => {
      const gen = onAnonymousSignInStart();
      expect(gen.next().value).toEqual(
        takeLatest(authActionTypes.ANONYMOUS_SIGN_IN_START, signInAnonymously)
      );
    });

    it('onSignOutStart watches SIGN_OUT_START', () => {
      const gen = onSignOutStart();
      expect(gen.next().value).toEqual(
        takeLatest(authActionTypes.SIGN_OUT_START, signOut)
      );
    });

    it('onSignUpStart watches SIGN_UP_START', () => {
      const gen = onSignUpStart();
      expect(gen.next().value).toEqual(
        takeLatest(authActionTypes.SIGN_UP_START, signUp)
      );
    });

    it('onSignUpSuccess watches SIGN_UP_SUCCESS', () => {
      const gen = onSignUpSuccess();
      expect(gen.next().value).toEqual(
        takeLatest(authActionTypes.SIGN_UP_SUCCESS, signInAfterSignUp)
      );
    });
  });

  describe('authSagas root', () => {
    const gen = authSagas();

    it('yields all watcher sagas', () => {
      expect(gen.next().value).toEqual(
        all([
          call(onCheckUserSession),
          call(onGoogleSignInStart),
          call(onEmailSignInStart),
          call(onAnonymousSignInStart),
          call(onSignOutStart),
          call(onSignUpStart),
          call(onSignUpSuccess),
        ])
      );
    });

    it('completes', () => {
      expect(gen.next().done).toBe(true);
    });
  });
});
