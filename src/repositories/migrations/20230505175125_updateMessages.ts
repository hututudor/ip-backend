import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('messages', table => {
    table.dropColumn('userId');
    table.string('senderId').nullable();
    table.string('receiverId').notNullable();
    table.dropColumn('type');
    table.bigInteger('time');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('messages', table => {
    table.string('userId').notNullable();
    table.dropColumn('senderId');
    table.dropColumn('receiverId');
    table.string('type', 256).notNullable();
    table.dropColumn('time');
  });
}
