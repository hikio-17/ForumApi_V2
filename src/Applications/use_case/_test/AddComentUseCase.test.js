const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddCommentUseCase = require('../AddCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('AddComentUseCase', () => {
  it('should throw error if threadId, credentialId not string', async () => {
    // Arrange
    const newComment = { content: 'sebuah comment' };
    const threadRepository = new ThreadRepository();
    const commentRepository = new CommentRepository();
    const addCommentUseCase = new AddCommentUseCase({ threadRepository, commentRepository });
    const credentialId = 1234;
    const threadId = 'thread-123';

    // Action & Assert
    await expect(addCommentUseCase.execute(newComment, threadId, credentialId)).rejects.toThrowError('ADD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah comment',
    };

    const mockAddedComment = {
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-1234',
    };

    const threadId = 'thread-123';
    const credentialId = 'user-1234';

    // Creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking needed function
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(mockAddedComment));

    // creating use case instance
    const getCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const newAddedComent = await getCommentUseCase.execute(useCasePayload, threadId, credentialId);

    // Assert
    expect(newAddedComent).toEqual({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-1234',
    });

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      content: 'sebuah comment',
    }, threadId, credentialId));
  });
});
