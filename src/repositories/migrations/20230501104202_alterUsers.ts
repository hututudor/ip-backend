import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', table => {
    table.dropColumn('name');
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', table => {
    table.dropColumn('firstName');
    table.dropColumn('lastName');
    table.string('name').notNullable();
  });
}
