import { execSync } from 'child_process';

console.log('--- Starting Unovia Prebuild Pipeline ---');

try {
  console.log('1/2 Fetching latest daily market news...');
  execSync('node scripts/fetch-news.mjs', { stdio: 'inherit' });
} catch (error) {
  console.warn('Prebuild step 1 (fetch-news) warning:', error?.message);
}

try {
  console.log('2/2 Checking and generating automated Tax, GST & Wealth blogs...');
  execSync('node scripts/generate-blogs.mjs', { stdio: 'inherit' });
} catch (error) {
  console.warn('Prebuild step 2 (generate-blogs) warning:', error?.message);
}

console.log('--- Prebuild Pipeline Completed Successfully ---');
