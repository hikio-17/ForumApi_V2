class SayHandler {
  constructor() {
    this.getSayHandler = this.getSayHandler.bind(this);
  }

  async getSayHandler(request, h) {
    const response = h.response({
      value: 'Hello world!',
    });
    return response;
  }
}

module.exports = SayHandler;
