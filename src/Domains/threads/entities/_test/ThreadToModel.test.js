const ThreadToModel = require('../ThreadToModel');

describe('ThreadToModel entities', () => {
  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: true,
      created_at: 2023,
      title: 'sebuah title',
      body: 0,
    };

    // Action & Assert
    expect(() => new ThreadToModel(payload, '')).toThrowError('THREAD_TO_MODEL.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should return value payload correctly', () => {
    // Arrange
    const payloadThread = {
      id: 'thread-1234',
      title: 'ini berisi title',
      body: 'ini berisi body',
      created_at: '2023',
      username: 'studentDicoding',
    };

    // Action
    const thread = new ThreadToModel(payloadThread);

    // Assert
    expect(thread).toEqual({
      id: 'thread-1234',
      title: 'ini berisi title',
      body: 'ini berisi body',
      date: '2023',
      username: 'studentDicoding',
    });
  });
});
