
exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments(); //id field
    tbl.text('username', 240)
        .notNullable();
    tbl.text('password', 240)
    .notNullable();
    tbl.timestamps(true, true);
  });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
};
