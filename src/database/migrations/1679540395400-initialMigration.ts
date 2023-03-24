import {MigrationInterface, QueryRunner} from "typeorm";

export class initialMigration1679540395400 implements MigrationInterface {
    name = 'initialMigration1679540395400'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "closedFiled" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "closedFiled"`);
    }

}
