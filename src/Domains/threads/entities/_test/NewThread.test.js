const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'fake title',
    };

    // Assert and Action
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_COUNTAIN_NEDEED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 12345,
      body: 'fake body',
    };

    // Assert and Action
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when title countain more than 50 character', () => {
    // Arrange
    const payload = {
      title: 'titletitletitletitletitletitletitletitletitltetitleetrere',
      body: 'body content',
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should create newThreads object correctly', () => {
    // Arrange
    const payload = {
      title: 'problematika seorang programmer',
      body: 'sulit konsisten untuk belajar',
    };

    // Action
    const { title, body } = new NewThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
