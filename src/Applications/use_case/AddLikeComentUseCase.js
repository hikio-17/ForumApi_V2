class AddLikeCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId, commentId, credentialId) {
    this._verifyParams(threadId, commentId, credentialId);
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    await this._commentRepository.likesComments(commentId, credentialId);
  }

  _verifyParams(threadId, commentId, credentialId) {
    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof credentialId !== 'string') {
      throw new Error('ADD_LIKE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }
}

module.exports = AddLikeCommentUseCase;
