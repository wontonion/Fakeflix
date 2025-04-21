import upcomingMoviesReducer from "../upcoming.reducer";
import { moviesActionTypes } from "../movies.types";

describe("upcomingMoviesReducer", () => {
  const initialState = {
    loading: false,
    error: "",
    data: [],
  };

  it("should ignore unknown action and return unmodified state", () => {
    const next = upcomingMoviesReducer(initialState, {
      type: "Some unknown type",
    });
    expect(next).toEqual(initialState);
  });

  it("should handle FETCH_UPCOMING_MOVIES_REQUEST", () => {
    const action = { type: moviesActionTypes.FETCH_UPCOMING_MOVIES_REQUEST };
    const next = upcomingMoviesReducer(initialState, action);
    expect(next).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it("should handle FETCH_UPCOMING_MOVIES_SUCCESS", () => {
    const sample = [{ id: 1 }];
    const action = {
      type: moviesActionTypes.FETCH_UPCOMING_MOVIES_SUCCESS,
      payload: sample,
    };
    const next = upcomingMoviesReducer(
      { ...initialState, loading: true, error: "some error" },
      action
    );
    expect(next).toEqual({
      data: sample,
      loading: false,
      error: "",
    });
  });

  it("should handle LOAD_MORE_UPCOMING_MOVIES_SUCCESS", () => {
    const existing = [{ id: 1 }, { id: 2 }];
    const more = [{ id: 3 }];
    const action = {
      type: moviesActionTypes.LOAD_MORE_UPCOMING_MOVIES_SUCCESS,
      payload: more,
    };
    const next = upcomingMoviesReducer(
      { ...initialState, data: existing, loading: true, error: "some error" },
      action
    );
    expect(next).toEqual({
      loading: false,
      error: "",
      data: [...existing, ...more],
    });
  });

  it("should handle FETCH_UPCOMING_MOVIES_FAILURE", () => {
    const action = {
      type: moviesActionTypes.FETCH_UPCOMING_MOVIES_FAILURE,
      payload: "network error",
    };
    const next = upcomingMoviesReducer(
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
