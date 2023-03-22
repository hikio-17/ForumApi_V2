const AddComentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddLikeCommentUseCase = require('../../../../Applications/use_case/AddLikeComentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteComentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentByIdHandler = this.deleteCommentByIdHandler.bind(this);
    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { threadId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const addCommentUseCase = this._container.getInstance(AddComentUseCase.name);

    const addedComment = await addCommentUseCase.execute(request.payload, threadId, credentialId);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentByIdHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const deleteComentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

    await deleteComentUseCase.execute(commentId, threadId, credentialId);

    return {
      status: 'success',
    };
  }

  async putCommentLikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const addLikeCommentUseCase = this._container.getInstance(AddLikeCommentUseCase.name);
    await addLikeCommentUseCase.execute(threadId, commentId, credentialId);

    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
