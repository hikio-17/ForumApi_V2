class ThreadToModel {
  constructor(thread) {
    this._verifyThread(thread);

    this.id = thread.id;
    this.title = thread.title;
    this.body = thread.body;
    this.date = thread.created_at;
    this.username = thread.username;
  }

  _verifyThread({
    id, title, body, created_at, username,
  }) {
    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof created_at !== 'string' || typeof username !== 'string') {
      throw new Error('THREAD_TO_MODEL.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }
}

module.exports = ThreadToModel;
