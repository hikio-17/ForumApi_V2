const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddLikeCommentUseCase = require('../AddLikeComentUseCase');

describe('AddLikeCommentUseCase', () => {
  it('should throw error if commentId and threadId not string', async () => {
    // Arrange
    const threadId = 1234;
    const commentId = [];
    const credentialId = true;

    const commentRepository = new CommentRepository();
    const addLikeComentUseCase = new AddLikeCommentUseCase({ commentRepository });

    // Action & Assert
    await expect(addLikeComentUseCase.execute(threadId, commentId, credentialId)).rejects.toThrowError('ADD_LIKE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should orchestrating the add like comment action correctly', async () => {
    // Arrange
    const threadId = 'thread-1234';
    const commentId = 'comment-1234';
    const credentialId = 'user-1234';

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking needed function
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.likesComments = jest.fn(() => Promise.resolve());

    // creating use case instance
    const getAddLikeCommentUseCase = new AddLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await getAddLikeCommentUseCase.execute(threadId, commentId, credentialId);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(commentId);
    expect(mockCommentRepository.likesComments).toBeCalledWith(commentId, credentialId);
  });
});
