#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/4c6546728892cf0a65ac5d012d69dd630587a7038d2beb50a4a681a4807d5570/contract';
import startContract from '../../snapshots/4c6546728892cf0a65ac5d012d69dd630587a7038d2beb50a4a681a4807d5570/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/63d08c7f27d0a7b65aff1286405481d10a08a41a9d6a7720472fbbb48e74dab1/contract';
import endContract from '../../snapshots/63d08c7f27d0a7b65aff1286405481d10a08a41a9d6a7720472fbbb48e74dab1/contract.json' with { type: 'json' };
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
