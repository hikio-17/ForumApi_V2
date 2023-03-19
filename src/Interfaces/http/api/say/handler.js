class SayHandler {
  constructor() {
    this.getSayHandler = this.getSayHandler.bind(this);
  }

  async getSayHandler(request, h) {
    return {
      value: 'Hello world!',
    };
  }
}

module.exports = SayHandler;
