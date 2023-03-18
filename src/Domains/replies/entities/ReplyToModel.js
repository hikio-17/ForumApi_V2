class ReplyToModel {
  constructor(reply) {
    this._verifyReply(reply);

    this.id = reply.id;
    this.content = this.displayContent(reply);
    this.date = reply.created_at;
    this.username = reply.username;
  }

  displayContent(reply) {
    return reply.is_delete ? '**balasan telah dihapus**' : reply.content;
  }

  _verifyReply({
    id, content, created_at, username,
  }) {
    if (typeof id !== 'string' || typeof content !== 'string' || typeof created_at !== 'string' || typeof username !== 'string') {
      throw new Error('REPLY_TO_MODEL.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }
}

module.exports = ReplyToModel;
