#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/38dad1d9f005dadb56aad43bf64c33407364153236d483f75cf4c23fabede43c/contract';
import startContract from '../../snapshots/38dad1d9f005dadb56aad43bf64c33407364153236d483f75cf4c23fabede43c/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/eb1ced143a4ed7b58e292606ea0071087bbc57541b9a1665070729dc79eed665/contract';
import endContract from '../../snapshots/eb1ced143a4ed7b58e292606ea0071087bbc57541b9a1665070729dc79eed665/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [this.dropNotNull({ schema: 'public', table: 'research', column: 'url' })];
  }
}

MigrationCLI.run(import.meta.url, M);
