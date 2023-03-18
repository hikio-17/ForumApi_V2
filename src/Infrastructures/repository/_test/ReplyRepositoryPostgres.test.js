const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const NewAddedReplyComment = require('../../../Domains/replies/entities/NewAddedReplyComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  beforeEach(async () => {
    // add user owner thread
    await UsersTableTestHelper.addUser({ username: 'ownerThread', id: 'user-1111' });
    // add user owner comment
    await UsersTableTestHelper.addUser({ username: 'userComment', id: 'user-1234' });
    // add user owner reply comment
    await UsersTableTestHelper.addUser({ username: 'userReplyComment', id: 'user-2222' });

    // add thread == thradId='thread-1234' owner='user-1111'
    await ThreadsTableTestHelper.addThread('thread-1234', 'user-1111');
    // add comment ==== threadId = 'thread-1234', ownerComment = 'user-1234'
    await CommentsTableTestHelper.addComment({ content: 'sebuah comment' });
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe('addNewReplyComment function', () => {
    it('should persist add new reply comment and return value correctly', async () => {
      // Arrange
      const commentId = 'comment-1234'; // from addComment funtion
      const threadId = 'thread-1234'; // from addThread function
      const credentialId = 'user-2222'; // from add user
      const newReply = {
        content: 'balasan sebuah komentar',
      };
      const fakeIdGenerator = () => 1234;
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newReplyComment = await replyRepositoryPostgres.addNewReplyComment(newReply, threadId, commentId, credentialId);
      const reply = await RepliesTableTestHelper.getReplyById('reply-1234');

      // Assert
      expect(reply).toHaveLength(1);
      expect(newReplyComment).toEqual(new NewAddedReplyComment({
        id: 'reply-1234',
        content: 'balasan sebuah komentar',
        owner: 'user-2222',
      }));
    });
  });

  describe('getReplyCommentByThreadId function', () => {
    it('should persist get Reply Comment by Thread Id', async () => {
      // Arrange
      await RepliesTableTestHelper.addNewReply({ content: 'sebuah balasan komentar' }); // replyId = 'reply-1234'
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const reply = await replyRepositoryPostgres.getReplyCommentByThreadId('thread-1234');

      // Assert
      expect(reply).toEqual([{
        comment_id: 'comment-1234',
        content: 'sebuah balasan komentar',
        created_at: '2023',
        id: 'reply-1234',
        is_delete: false,
        username: 'userComment',
      }]);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw NotFoundError when replyId not available', async () => {
      // Arrange
      const replyId = 'replyId-fake';
      const credentialId = 'user-2222'; // from register user reply comment
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, credentialId)).rejects.toThrow(NotFoundError);
    });

    it('should throw AuthorizationError when credentialId not valid', async () => {
      // Arrange
      // add reply comment
      await RepliesTableTestHelper.addNewReply({ content: 'sebuah balasan komentar', owner: 'user-2222', threadId: 'thread-1234' }); // replyId = 'reply-1234', owner='user-2222'

      const replyId = 'reply-1234'; // from addNewReplyComment function
      const credentialId = 'userId-fake';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, credentialId)).rejects.toThrow(AuthorizationError);
    });

    it('should not throw NotFoundError and AuthorizationError when valide replyId and credentialId', async () => {
      // Arrange
      // add new Reply comment
      await RepliesTableTestHelper.addNewReply({ content: 'sebuah balasan komentar', id: 'reply-1234', owner: 'user-2222' });
      const replyId = 'reply-1234'; // from addNewReply function
      const credentialId = 'user-2222'; // from register user replyComment
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, credentialId)).resolves.not.toThrow(NotFoundError, AuthorizationError);
    });
  });

  describe('deleteReplyCommentById', () => {
    it('should persist deleteReplyCommentById', async () => {
      // Arrange
      // add new Reply comment
      await RepliesTableTestHelper.addNewReply({ content: 'sebuah balasan komentar', id: 'reply-1234', owner: 'user-2222' });
      const replyId = 'reply-1234';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReplyCommentById(replyId);
      const reply = await RepliesTableTestHelper.getReplyById(replyId);

      // Assert
      expect(reply[0].is_delete).toEqual(true);
    });
  });
});
