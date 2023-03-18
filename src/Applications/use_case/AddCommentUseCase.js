const NewComment = require('../../Domains/comments/entities/NewComment');

class AddComentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRespository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, threadId, credentialId) {
    this._verifyParams(threadId, credentialId);
    await this._threadRespository.verifyAvailableThread(threadId);
    const newComment = new NewComment(useCasePayload, threadId, credentialId);
    return this._commentRepository.addComment(newComment);
  }

  _verifyParams(threadId, credentialId) {
    if (typeof threadId !== 'string' || typeof credentialId !== 'string') {
      throw new Error('ADD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComentUseCase;
