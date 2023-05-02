import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('wills', table => {
    table.bigInteger('time').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('wills', table => {
    table.dropColumn('time');
  });
}
