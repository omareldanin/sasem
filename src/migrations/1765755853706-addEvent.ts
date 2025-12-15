import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEvent1765755853706 implements MigrationInterface {
    name = 'AddEvent1765755853706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`event\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` json NOT NULL, \`description\` json NOT NULL, \`fromDate\` timestamp NOT NULL, \`toDate\` timestamp NOT NULL, \`type\` enum ('KEYNOTE', 'SESSION', 'WORKSHOP', 'PANEL', 'TALK', 'SEMINAR', 'TUTORIAL', 'BREAKOUT', 'ROUNDTABLE', 'FIRESIDE_CHAT', 'POSTER', 'LIGHTNING', 'TRAINING', 'DEMO', 'NETWORKING') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` int NULL, INDEX \`IDX_b8c3aeeac35ace9d387fb5e142\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`event_users\` (\`eventId\` int NOT NULL, \`userId\` int NOT NULL, INDEX \`IDX_2c750b8b1b49a8b81d1f033497\` (\`eventId\`), INDEX \`IDX_1e747a4eb4854000a6641fca0f\` (\`userId\`), PRIMARY KEY (\`eventId\`, \`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`event\` ADD CONSTRAINT \`FK_1d5a6b5f38273d74f192ae552a6\` FOREIGN KEY (\`createdById\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`event_users\` ADD CONSTRAINT \`FK_2c750b8b1b49a8b81d1f0334974\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`event_users\` ADD CONSTRAINT \`FK_1e747a4eb4854000a6641fca0f6\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event_users\` DROP FOREIGN KEY \`FK_1e747a4eb4854000a6641fca0f6\``);
        await queryRunner.query(`ALTER TABLE \`event_users\` DROP FOREIGN KEY \`FK_2c750b8b1b49a8b81d1f0334974\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_1d5a6b5f38273d74f192ae552a6\``);
        await queryRunner.query(`DROP INDEX \`IDX_1e747a4eb4854000a6641fca0f\` ON \`event_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_2c750b8b1b49a8b81d1f033497\` ON \`event_users\``);
        await queryRunner.query(`DROP TABLE \`event_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_b8c3aeeac35ace9d387fb5e142\` ON \`event\``);
        await queryRunner.query(`DROP TABLE \`event\``);
    }

}
