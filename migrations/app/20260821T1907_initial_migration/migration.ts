#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/ee62fbb56223e8811f3756cee617ce0d59acc6eb9e8b59fec7b44961a9e98bbd/contract';
import startContract from '../../snapshots/ee62fbb56223e8811f3756cee617ce0d59acc6eb9e8b59fec7b44961a9e98bbd/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/a1851fbba0a022253719ce04bf56e5828e12a63771182dd81941b372115af791/contract';
import endContract from '../../snapshots/a1851fbba0a022253719ce04bf56e5828e12a63771182dd81941b372115af791/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [this.dropNotNull({ schema: 'public', table: 'research', column: 'url' })];
  }
}

MigrationCLI.run(import.meta.url, M);
