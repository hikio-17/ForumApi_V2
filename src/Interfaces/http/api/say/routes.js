const routes = (handler) => ([
  {
    method: 'GET',
    path: '/',
    handler: handler.getSayHandler,
  },
]);

module.exports = routes;
