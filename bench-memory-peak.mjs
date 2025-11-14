#!/usr/bin/env bun
// Run with: bun --expose-gc bench-memory-peak.mjs <original|optimized> <scenario>
// Measures peak heap usage during parsing by sampling memory at regular intervals

import { XMLParser as OriginalParser } from 'fast-xml-parser';
import { XMLParser as OptimizedParser } from 'fast-xml-parser-optimized';
import { generateFeedXml } from './utils-comprehensive.mjs';

const scenarios = {
  'rss-small': { items: 100, textSizeKB: 0.05, iterations: 100 },
  'rss-10mb': { items: 100, textSizeKB: 100, iterations: 10 },
  'rss-50mb': { items: 100, textSizeKB: 500, iterations: 3 },
};

const mode = process.argv[2];
const scenario = process.argv[3] || 'rss-small';

if (!mode || !['original', 'optimized'].includes(mode)) {
  console.error('Usage: bun --expose-gc bench-memory-peak.mjs <original|optimized> <scenario>');
  console.error('Scenarios:', Object.keys(scenarios).join(', '));
  process.exit(1);
}

if (!scenarios[scenario]) {
  console.error(`Unknown scenario: ${scenario}`);
  console.error('Available:', Object.keys(scenarios).join(', '));
  process.exit(1);
}

const config = scenarios[scenario];
const xml = generateFeedXml(config.items, config.textSizeKB);

const Parser = mode === 'original' ? OriginalParser : OptimizedParser;

// Ensure GC is available
if (typeof gc !== 'function') {
  console.error('Error: GC not exposed. Run with: bun --expose-gc');
  process.exit(1);
}

// Force GC and get baseline
gc();
await new Promise(resolve => setTimeout(resolve, 100)); // Let GC settle
const baseline = process.memoryUsage().heapUsed;

let peakHeap = baseline;

// Run parsing and track peak
const parser = new Parser();
for (let i = 0; i < config.iterations; i++) {
  parser.parse(xml);

  // Check memory after each parse
  const current = process.memoryUsage().heapUsed;
  if (current > peakHeap) {
    peakHeap = current;
  }
}

// Force GC and check final heap
gc();
await new Promise(resolve => setTimeout(resolve, 100));
const finalHeap = process.memoryUsage().heapUsed;

// Calculate peak delta and retained delta
const peakDelta = peakHeap - baseline;
const retainedDelta = finalHeap - baseline;
const peakMB = (peakDelta / 1024 / 1024).toFixed(2);
const retainedMB = (retainedDelta / 1024 / 1024).toFixed(2);

console.log(`Peak: ${peakMB} MB, Retained: ${retainedMB} MB (${mode}, ${scenario})`);
