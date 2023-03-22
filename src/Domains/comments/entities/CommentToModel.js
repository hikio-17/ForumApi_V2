/* eslint-disable no-shadow */
const ReplyToModel = require('../../replies/entities/ReplyToModel');

/* eslint-disable no-unused-expressions */
class CommentToModel {
  constructor(comment, replies) {
    this._verifyComment(comment);
    this._verifyReplies(replies);

    this.id = comment.id;
    this.username = comment.username;
    this.date = comment.created_at;
    this.replies = replies;
    this.content = this._displayContent(comment);
    this.likeCount = comment.likes ? comment.likes.length : 0;
  }

  _displayContent(comment) {
    return comment.is_delete ? '**komentar telah dihapus**' : comment.content;
  }

  _verifyComment({
    id, username, created_at, content,
  }) {
    if (typeof id !== 'string' || typeof username !== 'string' || typeof created_at !== 'string' || typeof content !== 'string') {
      throw new Error('COMMENT_TO_MODEL.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }

  _verifyReplies(replies) {
    replies.map((reply) => {
      if (typeof reply.id !== 'string' || typeof reply.username !== 'string' || typeof reply.date !== 'string' || typeof reply.content !== 'string' || typeof reply.content !== 'string') {
        replies.forEach((reply) => {
          if (reply instanceof ReplyToModel) {
            throw new Error('REPLIES.NOT_MEET_DATA_TYPE_SPESIFICATION');
          }
        });
        throw new Error('REPLIES.NOT_MEET_DATA_TYPE_SPESIFICATION');
      }
    });
  }
}

module.exports = CommentToModel;
