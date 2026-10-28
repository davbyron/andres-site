#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/109c2818e23a2be3ca33de04601672cedfc6c93e5ec97b5cd5c17dbe05ba75e6/contract';
import startContract from '../../snapshots/109c2818e23a2be3ca33de04601672cedfc6c93e5ec97b5cd5c17dbe05ba75e6/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/ce7cdfb736a2882ea957277943045eaa9617335a0e99219d71941d5deda1b293/contract';
import endContract from '../../snapshots/ce7cdfb736a2882ea957277943045eaa9617335a0e99219d71941d5deda1b293/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'vowelChart',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('filename', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
