const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddLikeCommentUseCase = require('../AddLikeComentUseCase');

describe('AddLikeCommentUseCase', () => {
  it('should throw error if commentId and threadId not string', async () => {
    // Arrange
    const commentId = [];
    const credentialId = true;

    const commentRepository = new CommentRepository();
    const addLikeComentUseCase = new AddLikeCommentUseCase({ commentRepository });

    // Action & Assert
    await expect(addLikeComentUseCase.execute(commentId, credentialId)).rejects.toThrowError('ADD_LIKE_COMMENT_USE_CASE_NOT_MEET_DATA_TYPE_SPESIFICATION');
  });

  it('should orchestrating the add like comment action correctly', async () => {
    // Arrange
    const commentId = 'comment-1234';
    const credentialId = 'user-1234';

    // creating dependency of use case
    const mockCommentRepository = new CommentRepository();

    // mocking needed function
    mockCommentRepository.likesComments = jest.fn(() => Promise.resolve());

    // creating use case instance
    const getAddLikeCommentUseCase = new AddLikeCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await getAddLikeCommentUseCase.execute(commentId, credentialId);

    // Assert
    expect(mockCommentRepository.likesComments).toBeCalledWith(commentId, credentialId);
  });
});
