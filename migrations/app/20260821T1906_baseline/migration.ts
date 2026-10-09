#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/ee62fbb56223e8811f3756cee617ce0d59acc6eb9e8b59fec7b44961a9e98bbd/contract';
import endContract from '../../snapshots/ee62fbb56223e8811f3756cee617ce0d59acc6eb9e8b59fec7b44961a9e98bbd/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'research',
        columns: [
          col('authors', 'text[]', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('pageNumbers', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('publication', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('url', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('year', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'research_authors_elem_not_null_2033f92a',
            'array_position("authors", NULL) IS NULL',
          ),
        ],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
