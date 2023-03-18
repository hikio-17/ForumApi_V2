const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies', () => {
  // create variable global
  let accessTokenUserA = '';
  let accessTokenUserB = '';
  let threadId = '';
  let commentId = '';

  beforeAll(async () => {
    /** create user and user login */
    const server = await createServer(container);

    // User A
    const createUserALoginPayload = {
      username: 'usera',
      password: 'secret',
    };

    // add user A
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'usera',
        password: 'secret',
        fullname: 'User A',
      },
    });
    // user A login
    const responseUserALogin = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: createUserALoginPayload,
    });

    const responseJsonUserALogin = JSON.parse(responseUserALogin.payload);
    const { accessToken: resultTokenUserA } = responseJsonUserALogin.data;
    accessTokenUserA = resultTokenUserA;

    // User B
    const createUserBLoginPayload = {
      username: 'userb',
      password: 'secret',
    };

    // add user B
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'userb',
        password: 'secret',
        fullname: 'User B',
      },
    });

    // user B login
    const responseUserBLogin = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: createUserBLoginPayload,
    });

    const responseJsonUserBLogin = JSON.parse(responseUserBLogin.payload);
    const { accessToken: resultTokenUserB } = responseJsonUserBLogin.data;
    accessTokenUserB = resultTokenUserB;

    /** Create Thread */
    const requestThreadPayload = {
      title: 'ini title',
      body: 'ini body',
    };

    const responseThread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestThreadPayload,
      headers: {
        Authorization: `Bearer ${accessTokenUserA}`,
      },
    });

    // set Variable threadId
    const responseThreadJson = JSON.parse(responseThread.payload);
    threadId = responseThreadJson.data.addedThread.id;

    /** create comment */
    const requestCommentPayload = {
      content: 'berisi sebuah comment',
    };

    const responseComment = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: requestCommentPayload,
      headers: {
        Authorization: `Bearer ${accessTokenUserB}`,
      },
    });
    // set variable commentId
    const responseCommentJson = JSON.parse(responseComment.payload);
    commentId = responseCommentJson.data.addedComment.id;
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  /** POST REPLIES ENDPOINT */
  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 401 when post new reply comment not authentication', async () => {
      // Arrange
      const requestPayload = {
        content: 'balasan sebuah komentar',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when threadId not available', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah balasan comment',
      };
      const fakeThreadId = 'fakeThreadId';
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${fakeThreadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });

    it('should response 404 when commentId not available', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah balasan comment',
      };
      const fakeCommentId = 'fakeCommentId';
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${fakeCommentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Comment tidak ditemukan');
    });

    it('should response 400 when request payload not meet data type spesification', async () => {
      // Arrange
      const requestPayload = {
        content: true,
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('reply comment harus berupa string');
    });

    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah balasan comment',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });
        // set variable replyId
      const responseJson = JSON.parse(response.payload);
      replyId = responseJson.data.addedReply.id;

      const reply = await RepliesTableTestHelper.getReplyById(replyId);

      // Assert
      expect(response.statusCode).toEqual(201);
      expect(reply).toHaveLength(1);
      expect(responseJson).toHaveProperty('status');
      expect(responseJson.status).toEqual('success');
      expect(responseJson).toHaveProperty('data');
      expect(responseJson.data).toHaveProperty('addedReply');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply).toHaveProperty('id');
      expect(responseJson.data.addedReply).toHaveProperty('content');
      expect(responseJson.data.addedReply).toHaveProperty('owner');
    });
  });

  /** DELETE REPLY COMMENT ENDPOINT */
  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 401 when not authentication', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when replyId not available', async () => {
      // Arrange
      const fakeReplyId = 'fakeReplyId';
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${fakeReplyId}`,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('reply comment tidak ditemukan');
    });

    it('should response 403 when delete not owner reply comment', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessTokenUserB}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda tidak berhak mengakses resource ini');
    });

    it('should response 200 when replyId available and valid owner replycomment', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });
      const reply = await RepliesTableTestHelper.getReplyById(replyId);

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(reply[0].is_delete).toEqual(true);
      expect(responseJson.status).toEqual('success');
    });
  });
});
