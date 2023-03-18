const ReplyToModel = require('../ReplyToModel');

describe('ReplyToModel entities', () => {
  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: true,
      created_at: 2023,
      content: 'sebuah balsan comment',
      is_delete: 0,
    };

    // Action & Assert
    expect(() => new ReplyToModel(payload, '')).toThrowError('REPLY_TO_MODEL.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should return value payload correctly', () => {
    // Arrange
    const contentFalseDelete = {
      id: 'reply-123',
      username: 'my user',
      created_at: '2023',
      content: 'sebuah balasan comment',
      is_delete: false,
    };

    const contentTrueDelete = {
      id: 'reply-123',
      username: 'my user',
      created_at: '2023',
      content: 'sebuah balasan comment',
      is_delete: true,
    };

    // Action
    const replyToModelFalseDelete = new ReplyToModel(contentFalseDelete);
    const replyToModelTrueDelete = new ReplyToModel(contentTrueDelete);

    // Assert
    expect(replyToModelFalseDelete).toEqual({
      id: 'reply-123',
      username: 'my user',
      date: '2023',
      content: 'sebuah balasan comment',
    });
    expect(replyToModelTrueDelete).toEqual({
      id: 'reply-123',
      username: 'my user',
      date: '2023',
      content: '**balasan telah dihapus**',
    });
  });
});
