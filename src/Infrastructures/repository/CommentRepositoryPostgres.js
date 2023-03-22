const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, threadId, credentialId } = newComment;

    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const isDelete = false;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, createdAt, credentialId, threadId, isDelete],
    };

    const { rows } = await this._pool.query(query);

    return rows[0];
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: 'SELECT comments.id, username, comments.created_at, comments.content, comments.is_delete, likes FROM comments INNER JOIN users ON users.id = comments.owner WHERE comments.thread_id = $1',
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }

  async verifyAvailableComment(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Comment tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, credentialId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    const { owner } = rows[0];
    if (rowCount && owner !== credentialId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini!');
    }
  }

  async likesComments(commentId, credentialId) {
    const queryCheckUserLike = {
      text: 'SELECT * FROM comments WHERE id = $1 AND $2 = ANY(likes)',
      values: [commentId, credentialId],
    };
    const { rowCount: userLike } = await this._pool.query(queryCheckUserLike);
    if (!userLike) {
      const query = {
        text: 'UPDATE comments SET likes = array_append(likes, $1) WHERE id = $2',
        values: [credentialId, commentId],
      };
      await this._pool.query(query);
    }

    if (userLike) {
      const queryUserUnlike = {
        text: 'UPDATE comments SET likes = array_remove(likes, $1) WHERE comments.id = $2',
        values: [credentialId, commentId],
      };

      await this._pool.query(queryUserUnlike);
      // console.log(commentId, credentialId);
    }
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2',
      values: [true, id],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
