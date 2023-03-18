const NewAddedComent = require('../NewAddedComment');

describe('NewAddedComment entities', () => {
  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'sebuah comment',
      owner: true,
    };

    // Action and Assert
    expect(() => new NewAddedComent(payload)).toThrowError('NEW_ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should create newAddedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Sebuah comment',
      owner: 'user-123',
    };

    // Action
    const newAddedComment = new NewAddedComent(payload);

    // Assert
    expect(newAddedComment.id).toEqual(payload.id);
    expect(newAddedComment.content).toEqual(payload.content);
    expect(newAddedComment.owner).toEqual(payload.owner);
  });
});
