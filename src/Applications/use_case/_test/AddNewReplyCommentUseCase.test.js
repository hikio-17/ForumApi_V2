const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddNewReplyCommentUseCase = require('../AddNewReplyCommentUseCase');
const NewReplyComment = require('../../../Domains/replies/entities/NewReplyComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('AddNewReplyCommentUseCase', () => {
  it('should throw error if threadId, credentialId not string', async () => {
    // Arrange
    const newReplyComment = { content: 'sebuah reply comment' };
    const threadRepository = new ThreadRepository();
    const commentRepository = new CommentRepository();
    const replyRepository = new ReplyRepository();
    const addNewReplyCommentUseCase = new AddNewReplyCommentUseCase({ threadRepository, commentRepository, replyRepository });
    const commentId = true;
    const credentialId = 1234;
    const threadId = 'thread-123';

    // Action & Assert
    await expect(addNewReplyCommentUseCase.execute(newReplyComment, threadId, commentId, credentialId)).rejects.toThrowError('NEW_REPLY_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the add reply comment action correctly', async () => {
    // Arrange
    const payload = {
      content: 'reply sebuah comment',
    };

    const mockAddNewReplyComment = {
      id: 'reply-123',
      content: 'reply sebuah comment',
      owner: 'user-123',
    };

    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const credentialId = 'userReply-123';

    // Creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking needed function
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
    mockReplyRepository.addNewReplyComment = jest.fn().mockImplementation(() => Promise.resolve(mockAddNewReplyComment));

    // creating use case intance
    const getAddNewReplyCommentUseCase = new AddNewReplyCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const newAddedReplyComment = await getAddNewReplyCommentUseCase.execute(payload, threadId, commentId, credentialId);

    // Assert
    expect(newAddedReplyComment).toEqual({
      id: 'reply-123',
      content: 'reply sebuah comment',
      owner: 'user-123',
    });
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(commentId);
    expect(mockReplyRepository.addNewReplyComment).toBeCalledWith(new NewReplyComment({
      content: 'reply sebuah comment',
    }), threadId, commentId, credentialId);
  });
});
