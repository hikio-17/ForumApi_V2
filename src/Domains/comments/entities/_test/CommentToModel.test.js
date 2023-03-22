const ReplyToModel = require('../../../replies/entities/ReplyToModel');
const CommentToModel = require('../CommentToModel');

describe('CommentToModel entities', () => {
  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: true,
      created_at: 2023,
      content: 'sebuah comment',
      is_delete: 0,
    };

    // Action & Assert
    expect(() => new CommentToModel(payload, [])).toThrowError('COMMENT_TO_MODEL.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should Throw Error when replies not meet data spesification', () => {
    // Arrange
    const comments = {
      id: 'comment-123',
      username: 'my user',
      created_at: '2023',
      content: 'sebuah comment',
      is_delete: false,
    };

    const replies = [
      {
        id: 123,
        username: true,
        date: '2023',
        content: 'sebuah comment',
      },
      {
        id: 12322,
        username: true,
        date: '2023',
        content: 'sebuah comment',
      },
    ];

    // Action & Assert
    expect(() => new CommentToModel(comments, replies)).toThrowError('REPLIES.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should return value payload correctly', () => {
    // Arrange
    const contentFalseDelete = {
      id: 'comment-123',
      username: 'my user',
      created_at: '2023',
      content: 'sebuah comment',
      is_delete: false,
      likes: null,
    };

    const contentTrueDelete = {
      id: 'comment-123',
      username: 'my user',
      created_at: '2023',
      content: 'sebuah comment',
      is_delete: true,
      likes: ['user-1234'],
    };

    // Action
    const commentToModelFalseDelete = new CommentToModel(contentFalseDelete, []);
    const commentToModelTrueDelete = new CommentToModel(contentTrueDelete, []);

    // Assert
    expect(commentToModelFalseDelete).toEqual({
      id: 'comment-123',
      username: 'my user',
      date: '2023',
      content: 'sebuah comment',
      replies: [],
      likeCount: 0,
    });
    expect(commentToModelTrueDelete).toEqual({
      id: 'comment-123',
      username: 'my user',
      date: '2023',
      content: '**komentar telah dihapus**',
      replies: [],
      likeCount: 1,
    });
  });
});
