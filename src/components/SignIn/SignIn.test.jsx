/**
 * @jest-environment node
 */

import React from "react";
import { shallow } from "enzyme";
import SignIn from "./SignIn";
import * as reactRedux from "react-redux";
import { Provider } from 'react-redux'
import { store } from "../../redux/store";

describe('required environment variables', () => {
  const required = [
    'REACT_APP_API_KEY',
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID',
    'REACT_APP_FIREBASE_MEASUREMENT_ID',
  ];
  required.forEach((name) => {
    it(`${name} should be defined`, () => {
      expect(process.env[name]).toBeDefined();
    });
  });
});


describe("Sign in component", () => {
  const useSelectorMock = jest.spyOn(reactRedux, "useSelector");
  const useDispatchMock = jest.spyOn(reactRedux, "useDispatch");
  beforeEach(() => {
    useSelectorMock.mockClear();
    useDispatchMock.mockClear();
  });

  it("should show the sign in text field", () => {
    useSelectorMock.mockReturnValue();
    const component = shallow(
      <Provider store={store}>
        <SignIn />
      </Provider>
    );
    console.log(component.debug());
  });
});
