/**
 * Dev test scenarios via query string, e.g. /tv?test01 or /play?test01.
 * Add more keys in shared/test-scenarios.js as needed.
 */

import { TEST_SCENARIOS } from '/shared/test-scenarios.js';

/** @returns {string | null} scenario id like "test01" */
export function getActiveTestScenarioId() {
  const params = new URLSearchParams(window.location.search);
  for (const id of Object.keys(TEST_SCENARIOS)) {
    if (params.has(id)) return id;
  }
  const named = params.get('test');
  if (named) {
    const id = named.startsWith('test') ? named : `test${named}`;
    if (TEST_SCENARIOS[id]) return id;
  }
  return null;
}
