const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const NewAddedComment = require('../../../Domains/comments/entities/NewAddedComment');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    // add User owner Thread
    await UsersTableTestHelper.addUser({ username: 'dicoding' }); // user owner dengan username dicoding

    // addThread
    const threadId = 'thread-1234';
    const credentialId = 'user-123';
    await ThreadsTableTestHelper.addThread(threadId, credentialId);

    // register user
    const fakeIdGenerator = () => '1234';

    const userCommentRegisterPayload = {
      username: 'userComment',
      password: 'secret',
      fullname: 'User Comment',
    };

    const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

    await userRepositoryPostgres.addUser(userCommentRegisterPayload);
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add new comment and return value correctly', async () => {
      // Arrange
      const comment = {
        content: 'berisi sebuah comment',
        threadId: 'thread-1234',
        credentialId: 'user-1234',
      };
      const fakeIdGenerator = () => 1234;
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newComment = await commentRepositoryPostgres.addComment(comment);
      const commentById = await CommentsTableTestHelper.findCommentById('comment-1234');

      // Assert
      expect(commentById).toHaveLength(1);
      expect(newComment).toEqual(new NewAddedComment({
        id: 'comment-1234',
        content: 'berisi sebuah comment',
        owner: 'user-1234',
      }));
    });
  });

  describe('likesComments function', () => {
    it('should persist add likes comments and return value correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ content: 'sebuah comment' }); // commentId = 'comment-1234'
      const commentId = 'comment-1234';
      const credentialId = 'user-123';
      const fakeIdGenerator = () => '1234';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.likesComments(commentId, credentialId);
      const likeCount = await CommentsTableTestHelper.likesComments(commentId);

      // Assert
      expect(likeCount).toHaveLength(1);
    });
  });

  describe('getCommentByThreadId', () => {
    it('should persist get comment by threadId and return value correctly', async () => {
      // Arrange
      const newComment = {
        content: 'sebuah comment',
      };
      await CommentsTableTestHelper.addComment(newComment); // commentId = 'thread-1234'
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comment = await commentRepositoryPostgres.getCommentByThreadId('thread-1234');

      // Assert
      expect(comment).toEqual(
        [{
          id: 'comment-1234',
          username: 'userComment',
          created_at: '2023',
          content: 'sebuah comment',
          is_delete: false,
        }],
      );
    });
  });

  describe('verifyAvailableComment function', () => {
    it('should throw NotFoundError whent commentId not available', async () => {
      // Arrange
      const commentId = 'commentId-fake';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment(commentId)).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when commentId available', async () => {
      // Arrange
      const newComment = {
        content: 'sebuah comment',
      };
      await CommentsTableTestHelper.addComment(newComment); // commentId = 'comment-1234'
      const commentId = 'comment-1234';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment(commentId)).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when commentId not available', async () => {
      // Arrange
      const commentId = 'commentId-fake';
      const credentialId = 'user-1234'; // owner comment
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, credentialId)).rejects.toThrow(NotFoundError);
    });

    it('should throw AutorizationError when credentialId not have commentOwner', async () => {
      // Arrrange
      const newComment = { content: 'sebuah comment' };
      await CommentsTableTestHelper.addComment(newComment); // commentId = 'comment-1234'
      const commentId = 'comment-1234';
      const credentialId = 'userId-fake';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, credentialId)).rejects.toThrow(AuthorizationError);
    });

    it('should not NotFoundError and AuthorizationError when valid commendId and CredentialId', async () => {
      // Arrange
      // add comment
      const newComment = {
        content: 'sebuah comment',
      };
      await CommentsTableTestHelper.addComment(newComment);
      const commentId = 'comment-1234';
      const credentialId = 'user-1234'; // userId owner comment
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, credentialId)).resolves.not.toThrow(NotFoundError, AuthorizationError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should persist deleteCommentById', async () => {
      // Arrange
      // add Comment
      const newComment = {
        content: 'sebuah comment',
      };
      await CommentsTableTestHelper.addComment(newComment); // commentId = 'comment-1234'
      const commentId = 'comment-1234';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById(commentId);
      const comment = await CommentsTableTestHelper.findCommentById(commentId);

      // Assert
      expect(comment[0].is_delete).toEqual(true);
    });
  });
});
