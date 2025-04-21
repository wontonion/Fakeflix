import horrorMoviesReducer from "../horror.reducer";
import { moviesActionTypes } from "../movies.types";

describe("horrorMoviesReducer", () => {
  const initialState = {
    loading: false,
    error: "",
    data: [],
  };

  it("should ignore unknown action and return unmodified state", () => {
    const next = horrorMoviesReducer(initialState, {
      type: "Some unknown type",
    });
    expect(next).toEqual(initialState);
  });

  it("should handle FETCH_HORROR_MOVIES_REQUEST", () => {
    const action = { type: moviesActionTypes.FETCH_HORROR_MOVIES_REQUEST };
    const next = horrorMoviesReducer(initialState, action);
    expect(next).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it("should handle FETCH_HORROR_MOVIES_SUCCESS", () => {
    const sample = [{ id: 1 }];
    const action = {
      type: moviesActionTypes.FETCH_HORROR_MOVIES_SUCCESS,
      payload: sample,
    };
    const next = horrorMoviesReducer(
      { ...initialState, loading: true, error: "some error" },
      action
    );
    expect(next).toEqual({
      data: sample,
      loading: false,
      error: "",
    });
  });

  it("should handle LOAD_MORE_HORROR_MOVIES_SUCCESS", () => {
    const existing = [{ id: 1 }, { id: 2 }];
    const more = [{ id: 3 }];
    const action = {
      type: moviesActionTypes.LOAD_MORE_HORROR_MOVIES_SUCCESS,
      payload: more,
    };
    const next = horrorMoviesReducer(
      { ...initialState, data: existing, loading: true, error: "some error" },
      action
    );
    expect(next).toEqual({
      loading: false,
      error: "",
      data: [...existing, ...more],
    });
  });

  it("should handle FETCH_HORROR_MOVIES_FAILURE", () => {
    const action = {
      type: moviesActionTypes.FETCH_HORROR_MOVIES_FAILURE,
      payload: "network error",
    };
    const next = horrorMoviesReducer(
      {
        ...initialState,
        loading: true,
        data: [{ id: 1 }],
        error: ""
      },
      action
    );
    expect(next).toEqual({
      loading: false,
      error: "network error",
      data: []
    });
  });
});
