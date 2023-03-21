exports.up = (pgm) => {
  pgm.addColumn('comments', {
    likes: {
      type: 'VARCHAR ARRAY',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('comments', 'likes');
};
