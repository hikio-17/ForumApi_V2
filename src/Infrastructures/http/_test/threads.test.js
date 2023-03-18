const pool = require('../../database/postgres/pool');
const ThreadsTableTestHandler = require('../../../../tests/ThreadsTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('/threads endpoint', () => {
  // create variable global
  let accessTokenUserA = '';
  let threadId = '';

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
  });

  afterAll(async () => {
    await ThreadsTableTestHandler.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads endpoint', () => {
    it('should response 401 when reqeust payload not authentication', async () => {
      // Arrange
      const requestPayload = {
        title: 'ini title',
        body: 'ini body',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when request payload not countain needed property', async () => {
      // Arrange
      const requestBadPayload = {
        title: 'ini title',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestBadPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson).toHaveProperty('status');
      expect(responseJson).toHaveProperty('message');
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    /** POST THREAD VALID PAYLOAD AND AUTHENTICATION */
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'ini title',
        body: 'ini body',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });

      // set Variable threadId
      const responseJson = JSON.parse(response.payload);
      threadId = responseJson.data.addedThread.id;

      const thread = await ThreadsTableTestHandler.findThreadById(threadId);

      // Assert
      expect(response.statusCode).toEqual(201);
      expect(thread).toHaveLength(1);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toHaveProperty('addedThread');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread).toHaveProperty('id');
      expect(responseJson.data.addedThread).toHaveProperty('title');
      expect(responseJson.data.addedThread).toHaveProperty('owner');
    });

    it('should response 400 when title more than 50 character', async () => {
      // Arrange
      const requestPayload = {
        title: 'fake title fake titikele kaaklhfa akhahjhg kha kahgkahg lhgjkfshhgfdhghfjhgfffgg',
        body: 'body',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena karakter title melebihi batas limit');
    });

    it('should response 400 when request payload not meet data type spesification', async () => {
      // Arrange
      const requestPayload = {
        title: true,
        body: 12345,
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenUserA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak seusai');
    });
  });

  /** GET THREAD ENDPOINT */
  describe('when GET /threads/{threadId}', () => {
    it('should response 20o and persisted thread', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });
      const thread = await ThreadsTableTestHandler.findThreadById(threadId);

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(thread).toHaveLength(1);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toHaveProperty('thread');
      expect(responseJson.data.thread).toBeDefined();
    });
  });
});
