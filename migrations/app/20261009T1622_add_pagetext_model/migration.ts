#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/36ea3b28a2668ebb6a1b6303b1f865a913704a0732ae198d1e4e7fc99d743292/contract';
import endContract from '../../snapshots/36ea3b28a2668ebb6a1b6303b1f865a913704a0732ae198d1e4e7fc99d743292/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/ce7cdfb736a2882ea957277943045eaa9617335a0e99219d71941d5deda1b293/contract';
import startContract from '../../snapshots/ce7cdfb736a2882ea957277943045eaa9617335a0e99219d71941d5deda1b293/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'pageText',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('key', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('value', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
