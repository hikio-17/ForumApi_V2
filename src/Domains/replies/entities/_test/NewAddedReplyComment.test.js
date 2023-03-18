const NewAddedReplyComment = require('../NewAddedReplyComment');

describe('NewAddedReplyComment entities', () => {
  it('should throw error when return reply comment not string', () => {
    // Arrange
    const payload = {
      id: 123,
      content: ['sebuah comment'],
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new NewAddedReplyComment(payload)).toThrowError('NEW_ADDED_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should create newReplyComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah reply dari comment',
      owner: 'user-123',
    };

    // Action
    const newAddedReplyComment = new NewAddedReplyComment(payload);

    // Assert
    expect(newAddedReplyComment.id).toEqual(payload.id);
    expect(newAddedReplyComment.content).toEqual(payload.content);
    expect(newAddedReplyComment.owner).toEqual(payload.owner);
  });
});
