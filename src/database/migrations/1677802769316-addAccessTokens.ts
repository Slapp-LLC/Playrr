import {MigrationInterface, QueryRunner} from "typeorm";

export class addAccessTokens1677802769316 implements MigrationInterface {
    name = 'addAccessTokens1677802769316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "OAuthAccessToken"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "OAuthRefreshToken"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "accessToken" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "refreshToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshToken"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "accessToken"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "OAuthRefreshToken" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "OAuthAccessToken" character varying`);
    }

}
