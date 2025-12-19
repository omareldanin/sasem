import { MigrationInterface, QueryRunner } from "typeorm";

export class Addcontact1766155228191 implements MigrationInterface {
    name = 'Addcontact1766155228191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`contact\` (\`id\` int NOT NULL AUTO_INCREMENT, \`emails\` json NOT NULL, \`phones\` json NOT NULL, \`address\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`eventId\` int NULL, UNIQUE INDEX \`REL_4e08f406b3957f25bf4e87dedb\` (\`eventId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`contact\` ADD CONSTRAINT \`FK_4e08f406b3957f25bf4e87dedb7\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contact\` DROP FOREIGN KEY \`FK_4e08f406b3957f25bf4e87dedb7\``);
        await queryRunner.query(`DROP INDEX \`REL_4e08f406b3957f25bf4e87dedb\` ON \`contact\``);
        await queryRunner.query(`DROP TABLE \`contact\``);
    }

}
