#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/db484c0b44d06241659db71c647b4edc95dcca3ab6d339d2a33ade2b860d2940/contract';
import startContract from '../../snapshots/db484c0b44d06241659db71c647b4edc95dcca3ab6d339d2a33ade2b860d2940/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/109c2818e23a2be3ca33de04601672cedfc6c93e5ec97b5cd5c17dbe05ba75e6/contract';
import endContract from '../../snapshots/109c2818e23a2be3ca33de04601672cedfc6c93e5ec97b5cd5c17dbe05ba75e6/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'language',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('levelId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'languageLevel',
        columns: [
          col('color', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'language',
        index: 'language_levelId_idx_622a0732',
        columns: ['levelId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'language',
        foreignKey: {
          name: 'language_levelId_fkey',
          columns: ['levelId'],
          references: { schema: 'public', table: 'languageLevel', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
