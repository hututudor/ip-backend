import Knex from 'knex';

export const knex = Knex({
  client: 'postgresql',
  migrations: {
    extension: 'ts',
    directory: './src/repositories/migrations',
  },
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: +process.env.DB_PORT!,
  },
});

export const migrate = async () => {
  console.log('runMigrations/start');
  await knex.migrate.rollback(); //linie temporara pentru a se actualiza numele coloanelor 'userId'
  await knex.migrate.latest();
  console.log('runMigrations/finished');
};
