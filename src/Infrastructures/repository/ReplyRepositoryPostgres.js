const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addNewReplyComment(newReply, threadId, commentId, credentialId) {
    const { content } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const isDelete = false;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, content, createdAt, credentialId, threadId, commentId, isDelete],
    };

    const { rows } = await this._pool.query(query);

    return rows[0];
  }

  async getReplyCommentByThreadId(threadId) {
    const query = {
      text: 'SELECT replies.id, username, replies.created_at, replies.content, replies.comment_id, replies.is_delete FROM replies INNER JOIN users ON users.id = replies.owner WHERE replies.thread_id = $1 ORDER BY created_at',
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }

  async verifyReplyOwner(replyId, credentialId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('reply comment tidak ditemukan');
    }

    const { owner } = rows[0];

    if (rowCount && owner !== credentialId) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }
  }

  async deleteReplyCommentById(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = $1 WHERE id = $2',
      values: [true, id],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
