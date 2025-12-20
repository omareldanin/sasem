import { MigrationInterface, QueryRunner } from "typeorm";

export class EditSponsor1766235632338 implements MigrationInterface {
    name = 'EditSponsor1766235632338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sponsor\` ADD \`isFeatured\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sponsor\` DROP COLUMN \`isFeatured\``);
    }

}
