import 'dotenv/config';
const databaseConfig = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: __dirname + '/../database/migrations',
  },
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  synchronize: true,
  migrationsRun: true,
  seeds: [__dirname + '/../database/seeds/**/*{.ts,.js}'],
  factories: [__dirname + '/../database/factories/**/*{.ts,.js}'],
};

export default databaseConfig;
