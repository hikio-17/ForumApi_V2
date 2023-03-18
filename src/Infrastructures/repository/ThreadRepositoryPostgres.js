const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread, userId) {
    const { title, body } = newThread;

    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, createdAt, userId],
    };

    const { rows } = await this._pool.query(query);

    return rows[0];
  }

  async getThreadById(threadId) {
    const queryThread = {
      text: 'SELECT threads.id, threads.title, threads.body, threads.created_at, users.username FROM threads INNER JOIN users ON users.id = threads.owner WHERE threads.id = $1',
      values: [threadId],
    };
    const { rows } = await this._pool.query(queryThread);
    return rows[0];
  }

  async verifyAvailableThread(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
