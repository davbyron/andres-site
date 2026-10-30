#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/0899a12882e3284dead38c7bebb359302a5c1ec9f82685cc095deaada9ff4116/contract';
import startContract from '../../snapshots/0899a12882e3284dead38c7bebb359302a5c1ec9f82685cc095deaada9ff4116/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/98f30937bba8069dfd50284484f07fbdd7d99c522993a6b80ad9a0c0e1085691/contract';
import endContract from '../../snapshots/98f30937bba8069dfd50284484f07fbdd7d99c522993a6b80ad9a0c0e1085691/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';
import postgres from '@prisma/orm-postgres/runtime';

// Query construction is local; the migration runner supplies the connection.
const { sql, contract } = postgres<End>({ contractJson: endContract });

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'languageLevel',
        column: col('order', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.dataTransform(contract, 'backfill-languageLevel-order', {
        check: () => sql.public.languageLevel.select('id')
          .where((fields, functions) => functions.eq(fields.order, null)).limit(1),
        // Existing IDs provide deterministic, unique initial order values.
        run: () => sql.public.languageLevel.update((fields) => ({ order: fields.id, updatedAt: fields.updatedAt }))
          .where((fields, functions) => functions.eq(fields.order, null)),
      }),
      this.setNotNull({ schema: 'public', table: 'languageLevel', column: 'order' }),
      this.addUnique({
        schema: 'public',
        table: 'languageLevel',
        constraint: 'languageLevel_order_key',
        columns: ['order'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
