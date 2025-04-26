import { selectModalState, selectModalContent } from '../modal.selectors';

describe('selectModalState selector', () => {
  const sampleClosed = true;
  const sampleContent = { foo: 'bar' };
  const stateWithModal = {
    detailModal: {
      modalIsClosed: sampleClosed,
      modalContent: sampleContent
    }
  };
  const stateWithEmptySlice = {
    detailModal: {}
  };

  it('returns modalIsClosed when state is well-formed', () => {
    expect(selectModalState(stateWithModal)).toBe(sampleClosed);
  });

  it('is memoized (same input returns same reference)', () => {
    const first = selectModalState(stateWithModal);
    const second = selectModalState(stateWithModal);
    expect(second).toBe(first);
  });

  it('returns empty slice if missing input', () => {
    const first = selectModalState(stateWithModal);
    const second = selectModalState();
    expect(second).toEqual(first);
  });

  it('returns empty slice if empty input', () => {
    const first = selectModalState(stateWithModal);
    const second = selectModalState({});
    expect(second).toEqual(first);
  });

  it('returns undefined when detailModal slice exists but modalIsClosed is missing', () => {
    expect(selectModalState(stateWithEmptySlice)).toBeUndefined();
  });
});

describe('selectModalContent selector', () => {
  const sampleClosed = true;
  const sampleContent = { foo: 'bar' };
  const stateWithModal = {
    detailModal: {
      modalIsClosed: sampleClosed,
      modalContent: sampleContent
    }
  };
  const stateWithEmptySlice = {
    detailModal: {}
  };

  it('returns modalContent when state is well-formed', () => {
    expect(selectModalContent(stateWithModal)).toBe(sampleContent);
  });

  it('is memoized (same input returns same reference)', () => {
    const first = selectModalContent(stateWithModal);
    const second = selectModalContent(stateWithModal);
    expect(second).toBe(first);
  });

  it('returns empty slice if missing input', () => {
    const first = selectModalContent(stateWithModal);
    const second = selectModalContent();
    expect(second).toEqual(first);
  });

  it('returns empty slice if empty input', () => {
    const first = selectModalContent(stateWithModal);
    const second = selectModalContent({});
    expect(second).toEqual(first);
  });

  it('returns undefined when detailModal slice exists but modalContent is missing', () => {
    expect(selectModalContent(stateWithEmptySlice)).toBeUndefined();
  });
});
