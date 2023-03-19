const SayHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'says',
  register: async (server) => {
    const saysHandler = new SayHandler(server);
    server.route(routes(saysHandler));
  },
};
