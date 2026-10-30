#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/0899a12882e3284dead38c7bebb359302a5c1ec9f82685cc095deaada9ff4116/contract';
import endContract from '../../snapshots/0899a12882e3284dead38c7bebb359302a5c1ec9f82685cc095deaada9ff4116/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/89c9c313384a8fa854ba3dd59101e1ceddab9ce74c219dca3309083477678015/contract';
import startContract from '../../snapshots/89c9c313384a8fa854ba3dd59101e1ceddab9ce74c219dca3309083477678015/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      ...this.renameColumn({ schema: 'public', table: 'research', column: 'year', to: 'date' }),
      ...this.renameColumn({ schema: 'public', table: 'unpublished', column: 'year', to: 'date' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
