import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1765588006342 implements MigrationInterface {
    name = 'Init1765588006342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`member\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`profession\` varchar(255) NOT NULL, \`gender\` enum ('male', 'female') NOT NULL, \`country\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`nationality\` varchar(255) NOT NULL, \`membershipNumber\` varchar(255) NULL, \`facebook\` varchar(255) NULL, \`x\` varchar(255) NULL, \`userId\` int NULL, UNIQUE INDEX \`REL_08897b166dee565859b7fb2fcc\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`refreshTokens\` json NULL, \`avatar\` varchar(255) NULL, \`fcm\` varchar(255) NULL, \`role\` enum ('admin', 'member', 'editor') NOT NULL DEFAULT 'member', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`IDX_8e1f623798118e629b46a9e629\` (\`phone\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`member\` ADD CONSTRAINT \`FK_08897b166dee565859b7fb2fcc8\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`member\` DROP FOREIGN KEY \`FK_08897b166dee565859b7fb2fcc8\``);
        await queryRunner.query(`DROP INDEX \`IDX_8e1f623798118e629b46a9e629\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`REL_08897b166dee565859b7fb2fcc\` ON \`member\``);
        await queryRunner.query(`DROP TABLE \`member\``);
    }

}
