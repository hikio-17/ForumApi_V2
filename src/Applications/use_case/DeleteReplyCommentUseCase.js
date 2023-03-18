class DeleteReplyCommentUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId, commentId, replyId, credentialId) {
    this._verifyParams(threadId, commentId, replyId, credentialId);
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    await this._replyRepository.verifyReplyOwner(replyId, credentialId);
    await this._replyRepository.deleteReplyCommentById(replyId);
  }

  _verifyParams(threadId, commentId, replyId, credentialId) {
    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof replyId !== 'string' || typeof credentialId !== 'string') {
      throw new Error('DELETE_REPLY_COMMENT_USE_CASE_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReplyCommentUseCase;
