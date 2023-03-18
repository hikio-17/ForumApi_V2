const NewAddedThread = require('../NewAddedThread');

describe('NewAddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'my title',
      body: 'my body thread',
    };

    // Action and Assert
    expect(() => new NewAddedThread(payload)).toThrowError('NEW_ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'my title',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new NewAddedThread(payload)).toThrowError('NEW_ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newAddedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'my title',
      owner: 'user-123',
    };

    // Action
    const newAddedThread = new NewAddedThread(payload);

    // Assert
    expect(newAddedThread.id).toStrictEqual(payload.id);
    expect(newAddedThread.title).toEqual(payload.title);
    expect(newAddedThread.owner).toEqual(payload.owner);
  });
});
