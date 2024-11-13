import { assert } from '@japa/assert';
import { configure, processCLIArgs, run } from '@japa/runner';

processCLIArgs(process.argv.splice(2));
configure({
  suites: [
    {
      name: 'unit',
      files: ['tests/unit/**/*.spec.ts'],
    },
    {
      name: 'functional',
      files: ['tests/functional/**/*.spec.ts'],
    },
  ],
  plugins: [assert()],
});

void run();
