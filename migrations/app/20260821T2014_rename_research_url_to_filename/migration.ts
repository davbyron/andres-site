#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/92aa29a764af22c9fb26b41bb914d4bac8acfa15cff8c9e6cb59ec79eca74cca/contract';
import endContract from '../../snapshots/92aa29a764af22c9fb26b41bb914d4bac8acfa15cff8c9e6cb59ec79eca74cca/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/a1851fbba0a022253719ce04bf56e5828e12a63771182dd81941b372115af791/contract';
import startContract from '../../snapshots/a1851fbba0a022253719ce04bf56e5828e12a63771182dd81941b372115af791/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'research', column: 'url' }),
      this.addColumn({
        schema: 'public',
        table: 'research',
        column: col('filename', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
