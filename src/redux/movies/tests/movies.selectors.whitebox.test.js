import * as selectors from '../movies.selectors'

describe('Movies Selectors', () => {
  const genres = [
    'action',
    'adventure',
    'animation',
    'comedy',
    'horror',
    'netflix',
    'romance',
    'topRated',
    'trending',
    'upcoming',
    'latest',
  ]

  const mockState = {
    movies: genres.reduce((acc, genre) => {
      const key = `${genre}Movies`
      acc[key] = {
        data: [`${genre}Item1`, `${genre}Item2`],
        loading: true,
        error: null,
      }
      return acc
    }, {}),
  }

  genres.forEach((genre) => {
    const sliceKey = `${genre}Movies`
    const primName = `select${genre[0].toUpperCase()}${genre.slice(1)}Movies`
    const memoName = `${primName}Selector`
    const fn = selectors[memoName];

    describe(`${primName}`, () => {
      it('returns the correct slice from state', () => {
        expect(selectors[primName](mockState)).toBe(mockState.movies[sliceKey])
      })
    })

    it("returns undefined when state is undefined", () => {
      expect(fn(undefined)).toBeUndefined();
    });

    it("returns undefined when movies slice is missing", () => {
      expect(fn({})).toBeUndefined();
    });

    it("returns undefined when specific genre slice is missing", () => {
      expect(fn({ movies: {} })).toBeUndefined();
    });

    describe(`${memoName}`, () => {
      it('returns the .data array for that genre', () => {
        expect(fn(mockState)).toEqual(
          mockState.movies[sliceKey].data
        )
      })
    })
  })
})
