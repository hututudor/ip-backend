import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('wills', table => {
    table.renameColumn('userID', 'userId');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('wills', table => {
    table.renameColumn('userId', 'userID');
  });
}
