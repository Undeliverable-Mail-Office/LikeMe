// @ts-check
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '.', testMatch: '*.spec.js', workers: 1,
  use: { baseURL: 'http://127.0.0.1:8188', browserName: 'chromium' },
  webServer: { command: 'node server.js', url: 'http://127.0.0.1:8188', reuseExistingServer: false },
});
