import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTextsModel1622547814341 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'texts',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'content',
          type: 'text',
        },
        {
          name: 'wordCount',
          type: 'int',
          isNullable: true
        },
        {
          name: 'characterCount',
          type: 'int',
          isNullable: true
        },
        {
          name: 'sentenceCount',
          type: 'int',
          isNullable: true
        },
        {
          name: 'paragraphCount',
          type: 'int',
          isNullable: true
        },
        {
          name: 'longestWord',
          type: 'varchar',
          isNullable: true
        },
        {
          name: 'userId',
          type: 'int',
        },
      ],
      foreignKeys: [
        {
          columnNames: ['userId'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('texts');
  }
}
