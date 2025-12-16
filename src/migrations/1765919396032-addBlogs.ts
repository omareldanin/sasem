import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBlogs1765919396032 implements MigrationInterface {
    name = 'AddBlogs1765919396032'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`blog\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` json NOT NULL, \`title\` json NULL, \`address\` json NULL, \`content\` json NOT NULL, \`date\` date NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`eventId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD CONSTRAINT \`FK_971831566573cfd3313edfbfaf2\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`blog\` DROP FOREIGN KEY \`FK_971831566573cfd3313edfbfaf2\``);
        await queryRunner.query(`DROP TABLE \`blog\``);
    }

}
