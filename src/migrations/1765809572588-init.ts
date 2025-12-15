import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1765809572588 implements MigrationInterface {
    name = 'Init1765809572588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`member\` (\`id\` int NOT NULL, \`title\` varchar(255) NOT NULL, \`gender\` enum ('male', 'female') NOT NULL, \`country\` varchar(255) NOT NULL, \`city\` varchar(255) NULL, \`specialty\` varchar(255) NULL, \`jopTitle\` varchar(255) NULL, \`membershipNumber\` varchar(255) NULL, \`facebook\` varchar(255) NULL, \`x\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`admin\` (\`id\` int NOT NULL, \`jobTitle\` varchar(255) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`event\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` json NOT NULL, \`description\` json NOT NULL, \`fromDate\` timestamp NOT NULL, \`toDate\` timestamp NOT NULL, \`cover\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`refreshTokens\` json NULL, \`avatar\` varchar(255) NULL, \`fcm\` varchar(255) NULL, \`role\` enum ('admin', 'member', 'editor') NOT NULL DEFAULT 'member', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`IDX_8e1f623798118e629b46a9e629\` (\`phone\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notifications\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`body\` text NOT NULL, \`data\` varchar(255) NULL, \`seen\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`communication_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`type\` enum ('email', 'sms') NOT NULL, \`destination\` varchar(255) NOT NULL, \`subject\` varchar(255) NOT NULL, \`message\` text NOT NULL, \`success\` tinyint NOT NULL DEFAULT 1, \`error\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`password_reset_tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`otp\` varchar(255) NOT NULL, \`expiresAt\` datetime NOT NULL, \`used\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`event_users\` (\`eventId\` int NOT NULL, \`userId\` int NOT NULL, INDEX \`IDX_2c750b8b1b49a8b81d1f033497\` (\`eventId\`), INDEX \`IDX_1e747a4eb4854000a6641fca0f\` (\`userId\`), PRIMARY KEY (\`eventId\`, \`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`member\` ADD CONSTRAINT \`FK_97cbbe986ce9d14ca5894fdc072\` FOREIGN KEY (\`id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`admin\` ADD CONSTRAINT \`FK_e032310bcef831fb83101899b10\` FOREIGN KEY (\`id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`event\` ADD CONSTRAINT \`FK_1d5a6b5f38273d74f192ae552a6\` FOREIGN KEY (\`createdById\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_692a909ee0fa9383e7859f9b406\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`event_users\` ADD CONSTRAINT \`FK_2c750b8b1b49a8b81d1f0334974\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`event_users\` ADD CONSTRAINT \`FK_1e747a4eb4854000a6641fca0f6\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event_users\` DROP FOREIGN KEY \`FK_1e747a4eb4854000a6641fca0f6\``);
        await queryRunner.query(`ALTER TABLE \`event_users\` DROP FOREIGN KEY \`FK_2c750b8b1b49a8b81d1f0334974\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_692a909ee0fa9383e7859f9b406\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_1d5a6b5f38273d74f192ae552a6\``);
        await queryRunner.query(`ALTER TABLE \`admin\` DROP FOREIGN KEY \`FK_e032310bcef831fb83101899b10\``);
        await queryRunner.query(`ALTER TABLE \`member\` DROP FOREIGN KEY \`FK_97cbbe986ce9d14ca5894fdc072\``);
        await queryRunner.query(`DROP INDEX \`IDX_1e747a4eb4854000a6641fca0f\` ON \`event_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_2c750b8b1b49a8b81d1f033497\` ON \`event_users\``);
        await queryRunner.query(`DROP TABLE \`event_users\``);
        await queryRunner.query(`DROP TABLE \`password_reset_tokens\``);
        await queryRunner.query(`DROP TABLE \`communication_logs\``);
        await queryRunner.query(`DROP TABLE \`notifications\``);
        await queryRunner.query(`DROP INDEX \`IDX_8e1f623798118e629b46a9e629\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`event\``);
        await queryRunner.query(`DROP TABLE \`admin\``);
        await queryRunner.query(`DROP TABLE \`member\``);
    }

}
