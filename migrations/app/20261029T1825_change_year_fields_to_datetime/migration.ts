#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/02d401673a37ac2dd48d829d28a9c5cb8622715b3c36c20c38dc2ad852a050af/contract';
import startContract from '../../snapshots/02d401673a37ac2dd48d829d28a9c5cb8622715b3c36c20c38dc2ad852a050af/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/89c9c313384a8fa854ba3dd59101e1ceddab9ce74c219dca3309083477678015/contract';
import endContract from '../../snapshots/89c9c313384a8fa854ba3dd59101e1ceddab9ce74c219dca3309083477678015/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.alterColumnType({
        schema: 'public',
        table: 'research',
        column: 'year',
        options: {
          qualifiedTargetType: 'timestamptz',
          formatTypeExpected: 'timestamp with time zone',
          rawTargetTypeForLabel: 'timestamptz',
          // Existing records only have a year; preserve it as January 1 in UTC.
          using: `make_timestamptz("year", 1, 1, 0, 0, 0, 'UTC')`,
        },
      }),
      this.alterColumnType({
        schema: 'public',
        table: 'unpublished',
        column: 'year',
        options: {
          qualifiedTargetType: 'timestamptz',
          formatTypeExpected: 'timestamp with time zone',
          rawTargetTypeForLabel: 'timestamptz',
          // Existing records only have a year; preserve it as January 1 in UTC.
          using: `make_timestamptz("year", 1, 1, 0, 0, 0, 'UTC')`,
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
