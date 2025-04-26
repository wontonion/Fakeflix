import * as actions from '../auth.actions'
import { authActionTypes } from '../auth.types'

describe('Auth Action Creators', () => {
  it('checkUserSession should create the correct action', () => {
    const expected = { type: authActionTypes.CHECK_USER_SESSION }
    expect(actions.checkUserSession()).toEqual(expected)
  })

  it('emailSignInStart should create the correct action with payload', () => {
    const credentials = { email: 'foo@bar.com', password: '123456' }
    const expected = {
      type: authActionTypes.EMAIL_SIGN_IN_START,
      payload: credentials
    }
    expect(actions.emailSignInStart(credentials)).toEqual(expected)
  })

  it('googleSignInStart should create the correct action', () => {
    const expected = { type: authActionTypes.GOOGLE_SIGN_IN_START }
    expect(actions.googleSignInStart()).toEqual(expected)
  })

  it('anonymousSignInStart should create the correct action', () => {
    const expected = { type: authActionTypes.ANONYMOUS_SIGN_IN_START }
    expect(actions.anonymousSignInStart()).toEqual(expected)
  })

  it('signInSuccess should create the correct action with user payload', () => {
    const user = { id: '1', name: 'Alice' }
    const expected = {
      type: authActionTypes.SIGN_IN_SUCCESS,
      payload: user
    }
    expect(actions.signInSuccess(user)).toEqual(expected)
  })

  it('signInFailure should create the correct action with error payload', () => {
    const error = new Error('nope')
    const expected = {
      type: authActionTypes.SIGN_IN_FAILURE,
      payload: error
    }
    expect(actions.signInFailure(error)).toEqual(expected)
  })

  it('signOutStart should create the correct action', () => {
    const expected = { type: authActionTypes.SIGN_OUT_START }
    expect(actions.signOutStart()).toEqual(expected)
  })

  it('signOutSuccess should create the correct action', () => {
    const expected = { type: authActionTypes.SIGN_OUT_SUCCESS }
    expect(actions.signOutSuccess()).toEqual(expected)
  })

  it('signOutFailure should create the correct action with error payload', () => {
    const error = 'oops'
    const expected = {
      type: authActionTypes.SIGN_OUT_FAILURE,
      payload: error
    }
    expect(actions.signOutFailure(error)).toEqual(expected)
  })

  it('signUpStart should create the correct action with payload', () => {
    const creds = { email: 'x@y.com', password: 'pw', displayName: 'X' }
    const expected = {
      type: authActionTypes.SIGN_UP_START,
      payload: creds
    }
    expect(actions.signUpStart(creds)).toEqual(expected)
  })

  it('signUpSuccess should create the correct action with user and additionalData payload', () => {
    const user = { id: 'u1' }
    const additionalData = { foo: 'bar' }
    const expected = {
      type: authActionTypes.SIGN_UP_SUCCESS,
      payload: { user, additionalData }
    }
    expect(actions.signUpSuccess({ user, additionalData })).toEqual(expected)
  })

  it('signUpFailure should create the correct action with error payload', () => {
    const error = { message: 'bad' }
    const expected = {
      type: authActionTypes.SIGN_UP_FAILURE,
      payload: error
    }
    expect(actions.signUpFailure(error)).toEqual(expected)
  })
})
