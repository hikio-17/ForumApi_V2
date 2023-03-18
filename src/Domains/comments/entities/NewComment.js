class NewComment {
  constructor(payload, threadId, credentialId) {
    this._verifyPayload(payload, threadId, credentialId);

    const { content } = payload;
    this.content = content;
    this.threadId = threadId;
    this.credentialId = credentialId;
  }

  _verifyPayload({ content }, threadId, credentialId) {
    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof credentialId !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }
}

module.exports = NewComment;
