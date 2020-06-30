
exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments();
    tbl.text('username', 240)
        .notNullable();
        tbl.text('username', 240)
        .notNullable();
    tbl.timestamps(true, true);
    tbl.integer('id')
        .increments()
        .primary()
        .notNullable();
  });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
};
