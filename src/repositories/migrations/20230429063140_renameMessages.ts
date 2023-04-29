import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('messages', table => {
    table.renameColumn('userID', 'userId');
    table.renameColumn('lobbyID', 'lobbyId');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('messages', table => {
    table.renameColumn('userId', 'userID');
    table.renameColumn('lobbyId', 'lobbyID');
  });
}
