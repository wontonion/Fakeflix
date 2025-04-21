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

    describe(`${primName}`, () => {
      it('returns the correct slice from state', () => {
        expect(selectors[primName](mockState)).toBe(mockState.movies[sliceKey])
      })
    })

    describe(`${memoName}`, () => {
      it('returns the .data array for that genre', () => {
        expect(selectors[memoName](mockState)).toEqual(
          mockState.movies[sliceKey].data
        )
      })
    })
  })
})
