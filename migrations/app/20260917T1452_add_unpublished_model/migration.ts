#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/4c6546728892cf0a65ac5d012d69dd630587a7038d2beb50a4a681a4807d5570/contract';
import endContract from '../../snapshots/4c6546728892cf0a65ac5d012d69dd630587a7038d2beb50a4a681a4807d5570/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/861ecbead5975b8bc551ade77889a8733d2569581ac576a3bbdaf1e86cca11db/contract';
import startContract from '../../snapshots/861ecbead5975b8bc551ade77889a8733d2569581ac576a3bbdaf1e86cca11db/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'unpublished',
        columns: [
          col('authors', 'text[]', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('filename', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('year', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'unpublished_authors_elem_not_null_2033f92a',
            'array_position("authors", NULL) IS NULL',
          ),
        ],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
