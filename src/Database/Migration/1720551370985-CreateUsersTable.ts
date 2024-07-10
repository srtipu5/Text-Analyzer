import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1635341885123 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
          name: 'users',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'email',
              type: 'varchar',
            },
            {
              name: 'password',
              type: 'varchar',
            },
            {
              name: 'role',
              type: 'varchar',
              default: "'user'",
            },
          ],
        }));
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
      }
}
