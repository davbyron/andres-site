#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/63d08c7f27d0a7b65aff1286405481d10a08a41a9d6a7720472fbbb48e74dab1/contract';
import startContract from '../../snapshots/63d08c7f27d0a7b65aff1286405481d10a08a41a9d6a7720472fbbb48e74dab1/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/723aadccdc6a4d507b988f6a1bdd859784e98dea2fc501715bd97cb1b7a66edb/contract';
import endContract from '../../snapshots/723aadccdc6a4d507b988f6a1bdd859784e98dea2fc501715bd97cb1b7a66edb/contract.json' with { type: 'json' };
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
