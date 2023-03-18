class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(commentId, threadId, credentialId) {
    this._verifyParams(commentId, threadId, credentialId);
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, credentialId);
    await this._commentRepository.deleteCommentById(commentId);
  }

  _verifyParams(commentId, threadId, credentialId) {
    if (typeof commentId !== 'string' || typeof threadId !== 'string' || typeof credentialId !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentUseCase;
