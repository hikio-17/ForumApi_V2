const DeleteReplyCommentUseCase = require('../DeleteReplyCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('DeleteReplyCommentUseCase', () => {
  it('should throw error when commentId, threadId, replyId, credentialId not string', async () => {
    // Arrange
    const commentId = false;
    const threadId = null;
    const replyId = [];
    const credentialId = 123;

    const deleteReplyCommentUseCase = new DeleteReplyCommentUseCase({});

    // Action & Assert
    await expect(deleteReplyCommentUseCase.execute(threadId, commentId, replyId, credentialId)).rejects.toThrowError('DELETE_REPLY_COMMENT_USE_CASE_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete reply comment action correctly', async () => {
    // Arrange
    const commentId = 'comment-123';
    const threadId = 'thread-123';
    const credentialId = 'user-123';
    const replyId = 'reply-123';

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking needed function
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
    mockReplyRepository.deleteReplyCommentById = jest.fn(() => Promise.resolve());

    // creating use case instance
    const getDeleteReplyCommentUseCase = new DeleteReplyCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await getDeleteReplyCommentUseCase.execute(threadId, commentId, replyId, credentialId);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(commentId);
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(replyId, credentialId);
    expect(mockReplyRepository.deleteReplyCommentById).toBeCalledWith(replyId);
  });
});
