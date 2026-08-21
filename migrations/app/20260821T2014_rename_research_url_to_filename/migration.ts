#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/861ecbead5975b8bc551ade77889a8733d2569581ac576a3bbdaf1e86cca11db/contract';
import endContract from '../../snapshots/861ecbead5975b8bc551ade77889a8733d2569581ac576a3bbdaf1e86cca11db/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/eb1ced143a4ed7b58e292606ea0071087bbc57541b9a1665070729dc79eed665/contract';
import startContract from '../../snapshots/eb1ced143a4ed7b58e292606ea0071087bbc57541b9a1665070729dc79eed665/contract.json' with { type: 'json' };
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
