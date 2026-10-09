#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/36ea3b28a2668ebb6a1b6303b1f865a913704a0732ae198d1e4e7fc99d743292/contract';
import startContract from '../../snapshots/36ea3b28a2668ebb6a1b6303b1f865a913704a0732ae198d1e4e7fc99d743292/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/aadba106420a63646bdb276a0b3fba1888701c0ceca1f92aa5d0d401a5157260/contract';
import endContract from '../../snapshots/aadba106420a63646bdb276a0b3fba1888701c0ceca1f92aa5d0d401a5157260/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addCheckConstraint({
        schema: 'public',
        table: 'pageText',
        constraint: 'pageText_key_check_207d044d',
        expression: `"key" IN ('About Page', 'Vowel Chart Page')`,
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
