# fast-xml-parser Benchmarks

Collection of benchmarks for performance and memory optimizations for [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser).

## Comprehensive Benchmark Results

All optimizations tested on three scenarios: small RSS feeds (50 bytes/item), 10MB feeds (100KB/item), 50MB feeds (500KB/item).

### High Impact Optimizations (6-8% faster)

| Optimization | RSS-Small | RSS-10MB | RSS-50MB | Status | Branch |
|--------------|-----------|----------|----------|--------|--------|
| **M5: Regex reuse** | ✓ 1.08x (7.6%) | ✓ 1.07x (7.4%) | ✓ 1.06x (6.0%) | **HIGH IMPACT + Bug Fix** | [mem/reuse-regex](https://github.com/macieklamberski/fast-xml-parser-benchmarks/tree/mem/reuse-regex) |
| **P2: Entity early exit** | ✓ 1.07x (7.4%) | ✓ 1.07x (7.2%) | ✓ 1.06x (5.9%) | **HIGH IMPACT** | [perf/entity-replacement-early-exit](https://github.com/macieklamberski/fast-xml-parser-benchmarks/tree/perf/entity-replacement-early-exit) |
| **P3: Spread operator** | ✓ 1.07x (7.1%) | ✓ 1.06x (6.5%) | ✓ 1.07x (6.6%) | **HIGH IMPACT** | [perf/getallmatches-array-copy](https://github.com/macieklamberski/fast-xml-parser-benchmarks/tree/perf/getallmatches-array-copy) |
| **P4: unpairedTags Set** | ✓ 1.06x (6.4%) | ✓ 1.06x (6.5%) | ✓ 1.07x (7.0%) | **HIGH IMPACT** | [perf/unpairedtags-set-optimization](https://github.com/macieklamberski/fast-xml-parser-benchmarks/tree/perf/unpairedtags-set-optimization) |

### Minimal Impact Optimizations

| Optimization | RSS-Small | RSS-10MB | RSS-50MB | Status | Branch |
|--------------|-----------|----------|----------|--------|--------|
| **M4: Conditional trim** | ✗ 0.99x (-1%) | ✓ 1.00x (0.3%) | ✓ 1.02x (2.2%) | Minimal | [mem/conditional-trim](https://github.com/macieklamberski/fast-xml-parser-benchmarks/tree/mem/conditional-trim) |
| **P1: stopNodes Set** | ✓ 1.01x (0.9%) | ✓ 1.00x (0.3%) | ✓ 1.02x (1.8%) | Minimal (HIGH for stopNodes users) | [perf/optimize-wildcard-stopnodes](https://github.com/macieklamberski/fast-xml-parser-benchmarks/tree/perf/optimize-wildcard-stopnodes) ([PR #769](https://github.com/NaturalIntelligence/fast-xml-parser/pull/769)) |

### Unproductive Optimizations

| Optimization | RSS-Small | RSS-10MB | RSS-50MB | Status | Branch |
|--------------|-----------|----------|----------|--------|--------|
| **M1: Array push + join** | ✗ 0.92x (-8%) | ✗ 0.55x (-45%) | ✗ 0.06x (-94%) | ❌ UNPRODUCTIVE | [mem/array-push-join](https://github.com/macieklamberski/fast-xml-parser-benchmarks/tree/mem/array-push-join) |

**Note:** M1 proved V8 already optimizes string concatenation. Array allocation + push + join has more overhead than optimized `+=`.

## Memory Optimizations

- **[mem/line-ending-normalization](https://github.com/macieklamberski/fast-xml-parser-benchmarks/tree/mem/line-ending-normalization)** - mem: Skip line ending normalization for Unix files (M0 - Baseline)
- ❌ **[mem/array-push-join](https://github.com/macieklamberski/fast-xml-parser-benchmarks/tree/mem/array-push-join)** - UNPRODUCTIVE: Array push + join (8-94% slower, V8 already optimizes string concatenation)
- **[mem/conditional-trim](https://github.com/macieklamberski/fast-xml-parser-benchmarks/tree/mem/conditional-trim)** - mem: Check for whitespace before trimming tag names (M4)
- **[mem/reuse-regex](https://github.com/macieklamberski/fast-xml-parser-benchmarks/tree/mem/reuse-regex)** - mem: Reset regex lastIndex for safe module-scope regex reuse (M5)

## Performance Optimizations

- **[perf/optimize-wildcard-stopnodes](https://github.com/macieklamberski/fast-xml-parser-benchmarks/tree/perf/optimize-wildcard-stopnodes)** - perf: Use Set for stopNodes lookup O(1) instead of array iteration O(n) ([PR #769](https://github.com/NaturalIntelligence/fast-xml-parser/pull/769))
- **[perf/entity-replacement-early-exit](https://github.com/macieklamberski/fast-xml-parser-benchmarks/tree/perf/entity-replacement-early-exit)** - perf: Add early exit to entity replacement (PR TBD)
- **[perf/getallmatches-array-copy](https://github.com/macieklamberski/fast-xml-parser-benchmarks/tree/perf/getallmatches-array-copy)** - perf: Replace manual loop with spread operator in getAllMatches (PR TBD)
- **[perf/unpairedtags-set-optimization](https://github.com/macieklamberski/fast-xml-parser-benchmarks/tree/perf/unpairedtags-set-optimization)** - perf: Use Set for unpairedTags lookup instead of indexOf (PR TBD)
