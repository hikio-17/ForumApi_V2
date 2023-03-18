const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewAddedThread = require('../../../Domains/threads/entities/NewAddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadsRepositoryPostgres', () => {
  beforeEach(async () => {
    // add user
    await UsersTableTestHelper.addUser({ username: 'userThread', id: 'user-1234' });
  });
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });
  describe('ThreadRepository', () => {
    describe('addThread function', () => {
      it('should persist add new thread and return value correctly', async () => {
        // Arrange
        const newThread = new NewThread({
          title: 'ini title',
          body: 'ini body',
        });
        const credentialId = 'user-1234';
        const fakeIdGenerator = () => '1234';
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const newAddedThread = await threadRepositoryPostgres.addThread(newThread, credentialId);
        const thread = await ThreadsTableTestHelper.findThreadById('thread-1234');

        // Assert
        expect(thread).toHaveLength(1);
        expect(newAddedThread).toEqual({
          id: 'thread-1234',
          title: 'ini title',
          owner: 'user-1234',
        });
      });
    });
  });

  describe('verifyAvailbaleThread function', () => {
    it('should throw NotFoundError when threadId not available', async () => {
      // Arrange
      const threadId = 'threadid-fake';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread(threadId)).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError whent threadId available', async () => {
      // Arrange
      // add thread
      const threadId = 'thread-1234';
      const credentialId = 'user-1234';
      await ThreadsTableTestHelper.addThread(threadId, credentialId);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread(threadId)).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should persist getThreadById and return value correctly', async () => {
      // Arrange
      // add thread
      await ThreadsTableTestHelper.addThread('thread-1234', 'user-1234');
      const threadId = 'thread-1234'; // from addThread function
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(threadId);

      // Assert
      expect(thread).toEqual({
        id: 'thread-1234',
        title: 'ini title',
        body: 'ini body',
        created_at: '2023',
        username: 'userThread',
      });
    });
  });
});
