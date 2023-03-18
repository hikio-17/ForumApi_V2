const AddNewReplyCommentUseCase = require('../../../../Applications/use_case/AddNewReplyCommentUseCase');
const DeleteReplyCommentUseCase = require('../../../../Applications/use_case/DeleteReplyCommentUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postnewReplyCommentHandler = this.postnewReplyCommentHandler.bind(this);
    this.deleteReplyCommentByIdHandler = this.deleteReplyCommentByIdHandler.bind(this);
  }

  async postnewReplyCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const addNewReplyCommentUseCase = this._container.getInstance(AddNewReplyCommentUseCase.name);

    const addedReply = await addNewReplyCommentUseCase.execute(request.payload, threadId, commentId, credentialId);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyCommentByIdHandler(request, h) {
    const { threadId, commentId, replyId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const deleteReplyCommentUseCase = this._container.getInstance(DeleteReplyCommentUseCase.name);

    await deleteReplyCommentUseCase.execute(threadId, commentId, replyId, credentialId);

    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
