import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFiles1765903304011 implements MigrationInterface {
    name = 'AddFiles1765903304011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`file_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`file\` varchar(255) NOT NULL, \`type\` enum ('CONGRESS_BAG', 'FLOOR_PLAN') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`eventId\` int NULL, INDEX \`IDX_f7a392df5749468dcf869749ad\` (\`title\`), INDEX \`IDX_1b03750121cb502cb51124d880\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`file_entity\` ADD CONSTRAINT \`FK_997d2f76f0573a633867d1ee30f\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file_entity\` DROP FOREIGN KEY \`FK_997d2f76f0573a633867d1ee30f\``);
        await queryRunner.query(`DROP INDEX \`IDX_1b03750121cb502cb51124d880\` ON \`file_entity\``);
        await queryRunner.query(`DROP INDEX \`IDX_f7a392df5749468dcf869749ad\` ON \`file_entity\``);
        await queryRunner.query(`DROP TABLE \`file_entity\``);
    }

}
