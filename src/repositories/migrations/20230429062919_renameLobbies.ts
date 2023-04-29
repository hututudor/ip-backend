import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('lobbies', table => {
    table.renameColumn('userIDs', 'userIds');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('lobbies', table => {
    table.renameColumn('userIds', 'userIDs');
  });
}
