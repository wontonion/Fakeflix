import { showModalDetail, hideModalDetail } from '../modal.actions';
import { modalActionTypes } from '../modal.types';

describe('showModalDetail action creator', () => {
  const sampleContent = { id: 1, detail: 'info' };

  it('returns correct type and payload', () => {
    expect(showModalDetail(sampleContent)).toEqual({
      type: modalActionTypes.SHOW_MODAL_DETAILS,
      payload: sampleContent
    });
  });

  it('payload is undefined when no argument is passed', () => {
    expect(showModalDetail()).toEqual({
      type: modalActionTypes.SHOW_MODAL_DETAILS,
      payload: undefined
    });
  });
});

describe('hideModalDetail action creator', () => {
  it('returns correct type', () => {
    expect(hideModalDetail()).toEqual({
      type: modalActionTypes.HIDE_MODAL_DETAILS
    });
  });
});
