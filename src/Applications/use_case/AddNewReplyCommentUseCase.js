const NewReplyComment = require('../../Domains/replies/entities/NewReplyComment');

class AddNewReplyCommentUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(newReply, threadId, commentId, credentialId) {
    this._verifyParams(threadId, commentId, credentialId);
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    const newReplyComment = new NewReplyComment(newReply);
    return this._replyRepository.addNewReplyComment(newReplyComment, threadId, commentId, credentialId);
  }

  _verifyParams(threadId, commentId, credentialId) {
    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof credentialId !== 'string') {
      throw new Error('NEW_REPLY_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
module.exports = AddNewReplyCommentUseCase;
