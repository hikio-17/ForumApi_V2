const NewReplyComment = require('../NewReplyComment');

describe('NewReplyComment entities', () => {
  it('should throw error when payload data type not string', () => {
    // Arrange
    const payload = {
      content: [true, 'sebuah reply comment'],
    };

    // Action and Assert
    expect(() => new NewReplyComment(payload)).toThrowError('NEW_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should return values if payload data type correctyly', () => {
    // Arrange
    const payload = {
      content: 'sebuah string',
    };

    // Action
    const newReplyComment = new NewReplyComment(payload);

    // Assert
    expect(newReplyComment.content).toEqual(payload.content);
  });
});
