exports.up = (pgm) => {
  pgm.addColumn('comments', {
    likes: {
      type: 'VARCHAR(50) ARRAY',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('comments', 'likes');
};
