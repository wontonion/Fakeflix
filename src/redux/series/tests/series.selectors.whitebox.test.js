import {
  selectNetflixSeriesSelector,
  selectActionAdventureSeriesSelector,
  selectAnimationSeriesSelector,
  selectComedySeriesSelector,
  selectCrimeSeriesSelector,
  selectDocumentarySeriesSelector,
  selectFamilySeriesSelector,
  selectKidsSeriesSelector,
  selectSciFiFantasySeriesSelector,
  selectTrendingSeriesSelector
} from '../series.selectors';

const sampleData = [{ id: 1 }, { id: 2 }];

describe('selectNetflixSeriesSelector', () => {
  const stateWithData = { series: { netflixSeries: { data: sampleData } } };
  const stateWithEmptySlice = { series: { netflixSeries: {} } };

  it('returns data when state is well-formed', () => {
    expect(selectNetflixSeriesSelector(stateWithData)).toBe(sampleData);
  });

  it('is memoized (same input returns same reference)', () => {
    const first = selectNetflixSeriesSelector(stateWithData);
    const second = selectNetflixSeriesSelector(stateWithData);
    expect(second).toBe(first);
  });

  it('returns empty slice if missing input', () => {
    const first = selectNetflixSeriesSelector(stateWithData);
    const second = selectNetflixSeriesSelector();
    expect(second).toEqual(first);
  });

  it('returns empty slice if empty input', () => {
    const first = selectNetflixSeriesSelector(stateWithData);
    const second = selectNetflixSeriesSelector({});
    expect(second).toEqual(first);
  });

  it('returns undefined when slice exists but data missing', () => {
    expect(selectNetflixSeriesSelector(stateWithEmptySlice)).toBeUndefined();
  });
});

describe('selectActionAdventureSeriesSelector', () => {
  const stateWithData = { series: { actionAdventureSeries: { data: sampleData } } };
  const stateWithEmptySlice = { series: { actionAdventureSeries: {} } };

  it('returns data when state is well-formed', () => {
    expect(selectActionAdventureSeriesSelector(stateWithData)).toBe(sampleData);
  });

  it('is memoized (same input returns same reference)', () => {
    const first = selectActionAdventureSeriesSelector(stateWithData);
    const second = selectActionAdventureSeriesSelector(stateWithData);
    expect(second).toBe(first);
  });

  it('returns empty slice if missing input', () => {
    const first = selectActionAdventureSeriesSelector(stateWithData);
    const second = selectActionAdventureSeriesSelector();
    expect(second).toEqual(first);
  });

  it('returns empty slice if empty input', () => {
    const first = selectActionAdventureSeriesSelector(stateWithData);
    const second = selectActionAdventureSeriesSelector({});
    expect(second).toEqual(first);
  });

  it('returns undefined when slice exists but data missing', () => {
    expect(selectActionAdventureSeriesSelector(stateWithEmptySlice)).toBeUndefined();
  });
});

describe('selectAnimationSeriesSelector', () => {
  const stateWithData = { series: { animationSeries: { data: sampleData } } };
  const stateWithEmptySlice = { series: { animationSeries: {} } };

  it('returns data when state is well-formed', () => {
    expect(selectAnimationSeriesSelector(stateWithData)).toBe(sampleData);
  });

  it('is memoized (same input returns same reference)', () => {
    const first = selectAnimationSeriesSelector(stateWithData);
    const second = selectAnimationSeriesSelector(stateWithData);
    expect(second).toBe(first);
  });

  it('returns empty slice if missing input', () => {
    const first = selectAnimationSeriesSelector(stateWithData);
    const second = selectAnimationSeriesSelector();
    expect(second).toEqual(first);
  });

  it('returns empty slice if empty input', () => {
    const first = selectAnimationSeriesSelector(stateWithData);
    const second = selectAnimationSeriesSelector({});
    expect(second).toEqual(first);
  });

  it('returns undefined when slice exists but data missing', () => {
    expect(selectAnimationSeriesSelector(stateWithEmptySlice)).toBeUndefined();
  });
});

describe('selectComedySeriesSelector', () => {
  const stateWithData = { series: { comedySeries: { data: sampleData } } };
  const stateWithEmptySlice = { series: { comedySeries: {} } };

  it('returns data when state is well-formed', () => {
    expect(selectComedySeriesSelector(stateWithData)).toBe(sampleData);
  });

  it('is memoized (same input returns same reference)', () => {
    const first = selectComedySeriesSelector(stateWithData);
    const second = selectComedySeriesSelector(stateWithData);
    expect(second).toBe(first);
  });

  it('returns empty slice if missing input', () => {
    const first = selectComedySeriesSelector(stateWithData);
    const second = selectComedySeriesSelector();
    expect(second).toEqual(first);
  });

  it('returns empty slice if empty input', () => {
    const first = selectComedySeriesSelector(stateWithData);
    const second = selectComedySeriesSelector({});
    expect(second).toEqual(first);
  });

  it('returns undefined when slice exists but data missing', () => {
    expect(selectComedySeriesSelector(stateWithEmptySlice)).toBeUndefined();
  });
});

describe('selectCrimeSeriesSelector', () => {
  const stateWithData = { series: { crimeSeries: { data: sampleData } } };
  const stateWithEmptySlice = { series: { crimeSeries: {} } };

  it('returns data when state is well-formed', () => {
    expect(selectCrimeSeriesSelector(stateWithData)).toBe(sampleData);
  });

  it('is memoized (same input returns same reference)', () => {
    const first = selectCrimeSeriesSelector(stateWithData);
    const second = selectCrimeSeriesSelector(stateWithData);
    expect(second).toBe(first);
  });

  it('returns empty slice if missing input', () => {
    const first = selectCrimeSeriesSelector(stateWithData);
    const second = selectCrimeSeriesSelector();
    expect(second).toEqual(first);
  });

  it('returns empty slice if empty input', () => {
    const first = selectCrimeSeriesSelector(stateWithData);
    const second = selectCrimeSeriesSelector({});
    expect(second).toEqual(first);
  });

  it('returns undefined when slice exists but data missing', () => {
    expect(selectCrimeSeriesSelector(stateWithEmptySlice)).toBeUndefined();
  });
});

describe('selectDocumentarySeriesSelector', () => {
  const stateWithData = { series: { documentarySeries: { data: sampleData } } };
  const stateWithEmptySlice = { series: { documentarySeries: {} } };

  it('returns data when state is well-formed', () => {
    expect(selectDocumentarySeriesSelector(stateWithData)).toBe(sampleData);
  });

  it('is memoized (same input returns same reference)', () => {
    const first = selectDocumentarySeriesSelector(stateWithData);
    const second = selectDocumentarySeriesSelector(stateWithData);
    expect(second).toBe(first);
  });

  it('returns empty slice if missing input', () => {
    const first = selectDocumentarySeriesSelector(stateWithData);
    const second = selectDocumentarySeriesSelector();
    expect(second).toEqual(first);
  });

  it('returns empty slice if empty input', () => {
    const first = selectDocumentarySeriesSelector(stateWithData);
    const second = selectDocumentarySeriesSelector({});
    expect(second).toEqual(first);
  });

  it('returns undefined when slice exists but data missing', () => {
    expect(selectDocumentarySeriesSelector(stateWithEmptySlice)).toBeUndefined();
  });
});

describe('selectFamilySeriesSelector', () => {
  const stateWithData = { series: { familySeries: { data: sampleData } } };
  const stateWithEmptySlice = { series: { familySeries: {} } };

  it('returns data when state is well-formed', () => {
    expect(selectFamilySeriesSelector(stateWithData)).toBe(sampleData);
  });

  it('is memoized (same input returns same reference)', () => {
    const first = selectFamilySeriesSelector(stateWithData);
    const second = selectFamilySeriesSelector(stateWithData);
    expect(second).toBe(first);
  });

  it('returns empty slice if missing input', () => {
    const first = selectFamilySeriesSelector(stateWithData);
    const second = selectFamilySeriesSelector();
    expect(second).toEqual(first);
  });

  it('returns empty slice if empty input', () => {
    const first = selectFamilySeriesSelector(stateWithData);
    const second = selectFamilySeriesSelector({});
    expect(second).toEqual(first);
  });

  it('returns undefined when slice exists but data missing', () => {
    expect(selectFamilySeriesSelector(stateWithEmptySlice)).toBeUndefined();
  });
});

describe('selectKidsSeriesSelector', () => {
  const stateWithData = { series: { kidsSeries: { data: sampleData } } };
  const stateWithEmptySlice = { series: { kidsSeries: {} } };

  it('returns data when state is well-formed', () => {
    expect(selectKidsSeriesSelector(stateWithData)).toBe(sampleData);
  });

  it('is memoized (same input returns same reference)', () => {
    const first = selectKidsSeriesSelector(stateWithData);
    const second = selectKidsSeriesSelector(stateWithData);
    expect(second).toBe(first);
  });

  it('returns empty slice if missing input', () => {
    const first = selectKidsSeriesSelector(stateWithData);
    const second = selectKidsSeriesSelector();
    expect(second).toEqual(first);
  });

  it('returns empty slice if empty input', () => {
    const first = selectKidsSeriesSelector(stateWithData);
    const second = selectKidsSeriesSelector({});
    expect(second).toEqual(first);
  });

  it('returns undefined when slice exists but data missing', () => {
    expect(selectKidsSeriesSelector(stateWithEmptySlice)).toBeUndefined();
  });
});

describe('selectSciFiFantasySeriesSelector', () => {
  const stateWithData = { series: { sciFiFantasySeries: { data: sampleData } } };
  const stateWithEmptySlice = { series: { sciFiFantasySeries: {} } };

  it('returns data when state is well-formed', () => {
    expect(selectSciFiFantasySeriesSelector(stateWithData)).toBe(sampleData);
  });

  it('is memoized (same input returns same reference)', () => {
    const first = selectSciFiFantasySeriesSelector(stateWithData);
    const second = selectSciFiFantasySeriesSelector(stateWithData);
    expect(second).toBe(first);
  });

  it('returns empty slice if missing input', () => {
    const first = selectSciFiFantasySeriesSelector(stateWithData);
    const second = selectSciFiFantasySeriesSelector();
    expect(second).toEqual(first);
  });

  it('returns empty slice if empty input', () => {
    const first = selectSciFiFantasySeriesSelector(stateWithData);
    const second = selectSciFiFantasySeriesSelector({});
    expect(second).toEqual(first);
  });

  it('returns undefined when slice exists but data missing', () => {
    expect(selectSciFiFantasySeriesSelector(stateWithEmptySlice)).toBeUndefined();
  });
});

describe('selectTrendingSeriesSelector', () => {
  const stateWithData = { series: { trendingSeries: { data: sampleData } } };
  const stateWithEmptySlice = { series: { trendingSeries: {} } };

  it('returns data when state is well-formed', () => {
    expect(selectTrendingSeriesSelector(stateWithData)).toBe(sampleData);
  });

  it('is memoized (same input returns same reference)', () => {
    const first = selectTrendingSeriesSelector(stateWithData);
    const second = selectTrendingSeriesSelector(stateWithData);
    expect(second).toBe(first);
  });

  it('returns empty slice if missing input', () => {
    const first = selectTrendingSeriesSelector(stateWithData);
    const second = selectTrendingSeriesSelector();
    expect(second).toEqual(first);
  });

  it('returns empty slice if empty input', () => {
    const first = selectTrendingSeriesSelector(stateWithData);
    const second = selectTrendingSeriesSelector({});
    expect(second).toEqual(first);
  });

  it('returns undefined when slice exists but data missing', () => {
    expect(selectTrendingSeriesSelector(stateWithEmptySlice)).toBeUndefined();
  });
});
