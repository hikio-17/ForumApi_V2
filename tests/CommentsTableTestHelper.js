/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);

    return rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },

  async addComment(newComment) {
    const { content } = newComment;
    const id = 'comment-1234';
    const created_at = '2023';
    const owner = 'user-1234';
    const thread_id = 'thread-1234';
    const is_delete = false;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, created_at, owner, thread_id, is_delete],
    };

    await pool.query(query);
  },
};

module.exports = CommentsTableTestHelper;
