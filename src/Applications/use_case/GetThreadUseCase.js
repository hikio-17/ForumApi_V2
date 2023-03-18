const ThreadToModel = require('../../Domains/threads/entities/ThreadToModel');
const CommentToModel = require('../../Domains/comments/entities/CommentToModel');
const ReplyToModel = require('../../Domains/replies/entities/ReplyToModel');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const resultThread = await this._threadRepository.getThreadById(threadId);
    const resultComments = await this._commentRepository.getCommentByThreadId(threadId);
    const resultReplies = await this._replyRepository.getReplyCommentByThreadId(threadId);
    const thread = new ThreadToModel(resultThread);
    thread.comments = this._mapComments(resultComments, resultReplies);
    return thread;
  }

  _mapComments(resultComments, resultReplies) {
    return resultComments.map((comment) => {
      const replies = resultReplies.filter((reply) => reply.thread_id === comment.thread_id).map((reply) => new ReplyToModel(reply));

      return new CommentToModel(comment, replies);
    });
  }
}

module.exports = GetThreadUseCase;
