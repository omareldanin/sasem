import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSponsor1765835936574 implements MigrationInterface {
    name = 'AddSponsor1765835936574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`sponsor\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('PLATINUM', 'EXHIBITOR', 'OTHER') NOT NULL, \`image\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`eventId\` int NULL, INDEX \`IDX_4fe7e1ef51ef8ff350ec3115c2\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`sponsor\` ADD CONSTRAINT \`FK_d0e35277faa13cc6c3463892c80\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sponsor\` DROP FOREIGN KEY \`FK_d0e35277faa13cc6c3463892c80\``);
        await queryRunner.query(`DROP INDEX \`IDX_4fe7e1ef51ef8ff350ec3115c2\` ON \`sponsor\``);
        await queryRunner.query(`DROP TABLE \`sponsor\``);
    }

}
