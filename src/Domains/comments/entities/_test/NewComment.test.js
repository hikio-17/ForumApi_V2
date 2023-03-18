const NewComment = require('../NewComment');

describe('NewComment entities', () => {
  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 12345667890,
      threadId: true,
      credentialId: [],
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should return value if payload correctly value', () => {
    // Arrange
    const comment = {
      content: 'berisi sebuah comment',
    };

    const threadId = 'thread-1234';
    const credentialId = 'user-1234';

    // Action
    const newComment = new NewComment(comment, threadId, credentialId);

    // Assert
    expect(newComment.content).toEqual(comment.content);
    expect(newComment.threadId).toEqual(threadId);
    expect(newComment.credentialId).toEqual(credentialId);
  });
});
