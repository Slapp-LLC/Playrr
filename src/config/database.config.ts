import 'dotenv/config';
const databaseConfig = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
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
