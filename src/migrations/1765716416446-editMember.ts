import { MigrationInterface, QueryRunner } from "typeorm";

export class EditMember1765716416446 implements MigrationInterface {
    name = 'EditMember1765716416446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`member\` DROP COLUMN \`nationality\``);
        await queryRunner.query(`ALTER TABLE \`member\` ADD \`specialty\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`member\` ADD \`jopTitle\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`member\` DROP COLUMN \`jopTitle\``);
        await queryRunner.query(`ALTER TABLE \`member\` DROP COLUMN \`specialty\``);
        await queryRunner.query(`ALTER TABLE \`member\` ADD \`nationality\` varchar(255) NOT NULL`);
    }

}
