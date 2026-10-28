#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/db484c0b44d06241659db71c647b4edc95dcca3ab6d339d2a33ade2b860d2940/contract';
import endContract from '../../snapshots/db484c0b44d06241659db71c647b4edc95dcca3ab6d339d2a33ade2b860d2940/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/92aa29a764af22c9fb26b41bb914d4bac8acfa15cff8c9e6cb59ec79eca74cca/contract';
import startContract from '../../snapshots/92aa29a764af22c9fb26b41bb914d4bac8acfa15cff8c9e6cb59ec79eca74cca/contract.json' with { type: 'json' };
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
