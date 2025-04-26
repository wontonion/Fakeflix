import axios from "../../../axiosInstance";
import * as actions from "./../movies.actions";

jest.mock("../../../axiosInstance", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("Movie actions with axios and dispatch", () => {
  const sampleResponse = { results: [{ id: 1, title: "X" }] };
  const mapped = [{ id: 1, title: "X", isFavourite: false }];

  const suites = [
    {
      name: "Action",
      asyncFunc: actions.fetchActionMoviesAsync,
      request: actions.fetchActionMoviesRequest,
      success: actions.fetchActionMoviesSuccess,
      failure: actions.fetchActionMoviesFailure,
    },
    {
      name: "Adventure",
      asyncFunc: actions.fetchAdventureMoviesAsync,
      request: actions.fetchAdventureMoviesRequest,
      success: actions.fetchAdventureMoviesSuccess,
      failure: actions.fetchAdventureMoviesFailure,
    },
    {
      name: "Animation",
      asyncFunc: actions.fetchAnimationMoviesAsync,
      request: actions.fetchAnimationMoviesRequest,
      success: actions.fetchAnimationMoviesSuccess,
      failure: actions.fetchAnimationMoviesFailure,
    },
    {
      name: "Comedy",
      asyncFunc: actions.fetchComedyMoviesAsync,
      request: actions.fetchComedyMoviesRequest,
      success: actions.fetchComedyMoviesSuccess,
      failure: actions.fetchComedyMoviesFailure,
    },
    {
      name: "Horror",
      asyncFunc: actions.fetchHorrorMoviesAsync,
      request: actions.fetchHorrorMoviesRequest,
      success: actions.fetchHorrorMoviesSuccess,
      failure: actions.fetchHorrorMoviesFailure,
    },
    {
      name: "Netflix",
      asyncFunc: actions.fetchNetflixMoviesAsync,
      request: actions.fetchNetflixMoviesRequest,
      success: actions.fetchNetflixMoviesSuccess,
      failure: actions.fetchNetflixMoviesFailure,
    },
    {
      name: "Romance",
      asyncFunc: actions.fetchRomanceMoviesAsync,
      request: actions.fetchRomanceMoviesRequest,
      success: actions.fetchRomanceMoviesSuccess,
      failure: actions.fetchRomanceMoviesFailure,
    },
    {
      name: "TopRated",
      asyncFunc: actions.fetchTopRatedMoviesAsync,
      request: actions.fetchTopRatedMoviesRequest,
      success: actions.fetchTopRatedMoviesSuccess,
      failure: actions.fetchTopRatedMoviesFailure,
    },
    {
      name: "Trending",
      asyncFunc: actions.fetchTrendingMoviesAsync,
      request: actions.fetchTrendingMoviesRequest,
      success: actions.fetchTrendingMoviesSuccess,
      failure: actions.fetchTrendingMoviesFailure,
    },
    {
      name: "Upcoming",
      asyncFunc: actions.fetchUpcomingMoviesAsync,
      request: actions.fetchUpcomingMoviesRequest,
      success: actions.fetchUpcomingMoviesSuccess,
      failure: actions.fetchUpcomingTrendingMoviesFailure,
    },
    {
      name: "Latest",
      asyncFunc: actions.fetchLatestMoviesAsync,
      request: actions.fetchLatestMoviesRequest,
      success: actions.fetchLatestMoviesSuccess,
      failure: actions.fetchLatestTrendingMoviesFailure,
    },
  ];

  beforeEach(() => {
    axios.get.mockClear();
  });

  suites.forEach(({ name, asyncFunc, request, success, failure }) => {
    describe(`${name} Movies`, () => {
      const url = `/${name}`;
      let dispatch;

      beforeEach(() => {
        dispatch = jest.fn();
      });

      it("dispatches request then success when isPage=true", async () => {
        const promise = Promise.resolve({ data: sampleResponse });
        axios.get.mockReturnValue(promise);

        asyncFunc(url, true)(dispatch);

        expect(dispatch).toHaveBeenCalledWith(request());

        await promise;

        expect(dispatch).toHaveBeenCalledWith(success(mapped, true));
      });

      it("dispatches request then load-more when isPage=false", async () => {
        const promise = Promise.resolve({ data: sampleResponse });
        axios.get.mockReturnValue(promise);

        asyncFunc(url, false)(dispatch);
        expect(dispatch).toHaveBeenCalledWith(request());

        await promise;
        expect(dispatch).toHaveBeenCalledWith(success(mapped));
      });

      it("dispatches request then failure if axios errors", async () => {
        const err = new Error("network");
        const promise = Promise.reject(err);
        axios.get.mockReturnValue(promise);

        asyncFunc(url, true)(dispatch);
        expect(dispatch).toHaveBeenCalledWith(request());

        await promise.catch(() => { });

        expect(dispatch).toHaveBeenCalledWith(failure("network"));
      });
    });
  });
});
