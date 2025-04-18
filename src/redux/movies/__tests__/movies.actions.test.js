const moviesActions = require('../movies.actions');

// Mock the axios instance
jest.mock('../../../axiosInstance', () => ({
  get: jest.fn()
}));

// Import axios after mocking
const axiosInstance = require('../../../axiosInstance');

describe('Netflix Movies API Test', () => {
  test('fetches Netflix movies with successful API call', async () => {
    // Setup
    const dispatch = jest.fn();
    
    // Mock movie data that matches the API response structure
    const mockMovies = {
      results: [
        { 
          id: 1, 
          title: 'Stranger Things', 
          backdrop_path: '/path1.jpg',
          poster_path: '/poster1.jpg' 
        },
        { 
          id: 2, 
          title: 'The Witcher', 
          backdrop_path: '/path2.jpg',
          poster_path: '/poster2.jpg' 
        }
      ]
    };

    // Expected movies with isFavourite property added
    const expectedMoviesWithFavourite = mockMovies.results.map(movie => ({
      ...movie,
      isFavourite: false
    }));

    // Mock successful axios response
    axiosInstance.get.mockResolvedValueOnce({ data: mockMovies });

    // Execute the action
    // NOTE: When isPage=true, it uses FETCH_NETFLIX_MOVIES_SUCCESS type
    // When isPage=false, it uses LOAD_MORE_NETFLIX_MOVIES_SUCCESS type
    await moviesActions.fetchNetflixMoviesAsync('/discover/tv?with_networks=213', true)(dispatch);

    // Assertions
    expect(dispatch).toHaveBeenCalledTimes(2);
    
    // Should first dispatch the request action
    expect(dispatch).toHaveBeenNthCalledWith(
      1, 
      expect.objectContaining({
        type: 'FETCH_NETFLIX_MOVIES_REQUEST'
      })
    );
    
    // Should then dispatch the success action with the transformed movies data
    expect(dispatch).toHaveBeenNthCalledWith(
      2, 
      expect.objectContaining({
        type: 'FETCH_NETFLIX_MOVIES_SUCCESS',
        payload: expectedMoviesWithFavourite
      })
    );
    
    // Verify axios was called with the correct URL
    expect(axiosInstance.get).toHaveBeenCalledWith('/discover/tv?with_networks=213');
    expect(axiosInstance.get).toHaveBeenCalledTimes(1);
  });
}); 