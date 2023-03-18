class NewAddedReplyComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, owner } = payload;
    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({ id, content, owner }) {
    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_ADDED_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }
}

module.exports = NewAddedReplyComment;
