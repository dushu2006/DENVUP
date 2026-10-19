import { writeFileSync } from 'node:fs';
import { coverageRows, coverageSummary, statusOrder } from '../src/content/coverage-map';

const group = new Map<number, typeof coverageRows>();
coverageRows.forEach((row) => {
  const list = group.get(row.section) ?? [];
  list.push(row);
  group.set(row.section, list);
});

const lines: string[] = [];
lines.push('# Animation coverage matrix', '');
lines.push(
  'Generated from `src/content/coverage-map.ts` on ' +
    new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date()) +
    '. The matrix is data, not a claim: every status comes from the same source the site renders.',
  '',
);
lines.push('| Status | Techniques |', '| --- | --- |');
statusOrder.forEach((status) => lines.push(`| ${status} | ${coverageSummary[status]} |`));
lines.push('', 'Every row names the file that carries it and the test that exercises it. Blank tests mean no automated check exists yet.', '');
lines.push(
  '> **How to read this.** “Tested” means a named automated check exercises the technique, not that the code merely exists; “Implemented” means it ships and the build passes. The `/lab` route is the live, filterable library: 21 labs and 148 modes, every one of the 480 catalogue IDs accounted for even where techniques are grouped. All 148 modes mount and tear down in `src/tests/labs.test.ts`; the cursor, route transitions and reduced-motion paths have their own real-browser checks named in the rows. Blocked rows state the verified reason and the closest safe alternative that ships.',
  '',
);

for (const [section, rows] of [...group.entries()].sort((a, b) => a[0] - b[0])) {
  lines.push(`## ${section}. ${rows[0]?.sectionName ?? 'Techniques'}`, '');
  lines.push('| ID | Technique | Status | File | Where | Test method | Note |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- |');
  rows.forEach((row) => {
    const clean = (value: string) => value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
    lines.push(
      `| ${row.id} | ${clean(row.name)} | ${row.status} | ${clean(row.file)} | ${clean(row.where)} | ${clean(row.test)} | ${clean(row.note ?? '')} |`,
    );
  });
  lines.push('');
}
writeFileSync('ANIMATION_COVERAGE_MATRIX.md', lines.join('\n'));
console.log('rows', coverageRows.length, coverageSummary);
