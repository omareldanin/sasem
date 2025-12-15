import { MigrationInterface, QueryRunner } from "typeorm";

export class Run1765760019259 implements MigrationInterface {
    name = 'Run1765760019259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`member\` DROP FOREIGN KEY \`FK_08897b166dee565859b7fb2fcc8\``);
        await queryRunner.query(`DROP INDEX \`REL_08897b166dee565859b7fb2fcc\` ON \`member\``);
        await queryRunner.query(`ALTER TABLE \`member\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`member\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`member\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`member\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`member\` ADD \`id\` int NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`member\` ADD CONSTRAINT \`FK_97cbbe986ce9d14ca5894fdc072\` FOREIGN KEY (\`id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`member\` DROP FOREIGN KEY \`FK_97cbbe986ce9d14ca5894fdc072\``);
        await queryRunner.query(`ALTER TABLE \`member\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`member\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`member\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`member\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`member\` ADD \`userId\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_08897b166dee565859b7fb2fcc\` ON \`member\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`member\` ADD CONSTRAINT \`FK_08897b166dee565859b7fb2fcc8\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
