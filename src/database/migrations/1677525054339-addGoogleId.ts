import {MigrationInterface, QueryRunner} from "typeorm";

export class addGoogleId1677525054339 implements MigrationInterface {
    name = 'addGoogleId1677525054339'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "googleId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "googleId"`);
    }

}
