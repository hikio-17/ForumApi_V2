class AddLikeCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(commentId, credentialId) {
    this._verifyParams(commentId, credentialId);
    await this._commentRepository.likesComments(commentId, credentialId);
  }

  _verifyParams(commentId, credentialId) {
    if (typeof commentId !== 'string' || typeof credentialId !== 'string') {
      throw new Error('ADD_LIKE_COMMENT_USE_CASE_NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }
}

module.exports = AddLikeCommentUseCase;
