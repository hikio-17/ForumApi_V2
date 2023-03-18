const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteComentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error if commentId, threadId, credentialId not string', async () => {
    // Arrange
    const commentId = false;
    const threadId = null;
    const credentialId = 1234;

    const threadRepository = new ThreadRepository();
    const commentRepository = new CommentRepository();
    const deleteCommentUseCase = new DeleteCommentUseCase({ threadRepository, commentRepository });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(commentId, threadId, credentialId)).rejects.toThrowError('DELETE_COMMENT_USE_CASE_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const commentId = 'comment-123';
    const threadId = 'thread-123';
    const credentialId = 'user-123';

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking needed function
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn(() => Promise.resolve());

    // creating use case instance
    const getDeleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await getDeleteCommentUseCase.execute(commentId, threadId, credentialId);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(commentId);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(commentId, credentialId);
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(commentId);
  });
});
