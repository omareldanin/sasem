import { MigrationInterface, QueryRunner } from "typeorm";

export class AddlogsandOtp1765594011476 implements MigrationInterface {
    name = 'AddlogsandOtp1765594011476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`communication_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`type\` enum ('email', 'sms') NOT NULL, \`destination\` varchar(255) NOT NULL, \`subject\` varchar(255) NOT NULL, \`message\` text NOT NULL, \`success\` tinyint NOT NULL DEFAULT 1, \`error\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`password_reset_tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`otp\` varchar(255) NOT NULL, \`expiresAt\` datetime NOT NULL, \`used\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`password_reset_tokens\``);
        await queryRunner.query(`DROP TABLE \`communication_logs\``);
    }

}
