import { MigrationInterface, QueryRunner } from "typeorm";

export class EditMembe1765717886876 implements MigrationInterface {
    name = 'EditMembe1765717886876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`member\` DROP COLUMN \`profession\``);
        await queryRunner.query(`ALTER TABLE \`member\` CHANGE \`city\` \`city\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`member\` CHANGE \`specialty\` \`specialty\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`member\` CHANGE \`jopTitle\` \`jopTitle\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`member\` CHANGE \`jopTitle\` \`jopTitle\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`member\` CHANGE \`specialty\` \`specialty\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`member\` CHANGE \`city\` \`city\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`member\` ADD \`profession\` varchar(255) NOT NULL`);
    }

}
