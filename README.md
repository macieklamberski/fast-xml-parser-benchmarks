**PR:** [Entity Replacement Early Exit - perf: Add early exit to entity replacement](https://github.com/NaturalIntelligence/fast-xml-parser/pull/TBD)

Benchmarks for entity replacement optimization that adds early exit to skip expensive regex replacements when no ampersand is present.

## Quick Start

```bash
npm install
./bench.sh
```

Or run via GitHub Actions: https://github.com/macieklamberski/fast-xml-parser-benchmarks/actions/workflows/benchmark.yml (select this branch from the dropdown).

## What's Being Tested

RSS feed parsing performance with and without XML entities:
- **Entity types**: With entities (`&lt;`, `&gt;`, `&amp;`, `&quot;`) and without
- **Feed sizes**: 10, 20, 50, 100 items
- **Iterations**: 100 parses per benchmark run
- **Parser options**: `processEntities: true, htmlEntities: true` (always enabled)

## Benchmark Results

```
=======================================================================
Original Parser - Execution Time
=======================================================================

Entity Type \ Items |         10 |         20 |         50 |        100 |
      With Entities |    85.89ms |   116.59ms |   216.13ms |   367.81ms |
            Without |    86.69ms |   112.40ms |   207.03ms |   355.56ms |

=======================================================================
Optimized Parser - Execution Time
=======================================================================

Entity Type \ Items |         10 |         20 |         50 |        100 |
      With Entities |    77.62ms |   103.41ms |   180.43ms |   312.60ms |
            Without |    75.40ms |    97.86ms |   167.10ms |   277.21ms |

=======================================================================
Speedup (Original / Optimized)
=======================================================================

Entity Type \ Items |         10 |         20 |         50 |        100 |
      With Entities |      1.11x |      1.13x |      1.20x |      1.18x |
            Without |      1.15x |      1.15x |      1.24x |      1.28x |
```

## Key Findings

**Significant performance improvements:**
- **With entities**: 1.11x - 1.20x (11-20% faster)
- **Without entities**: 1.15x - 1.28x (15-28% faster)

**Why "without entities" shows bigger improvement:**
- Both test cases have `processEntities: true` enabled
- **"Without entities"**: Plain text, no `&` character → early exit skips ALL regex replacements
- **"With entities"**: Contains `&` character → still processes all regexes, but saves overhead

The optimization shines when entity processing is enabled but most text nodes don't contain entities (common case).

## Optimization Explained

### The Problem

`replaceEntitiesValue()` is called on every text node. When `processEntities: true`, the original implementation loops through all entity replacement regexes even when the text contains no entities (no `&` character).

### The Solution

Added a surgical 2-line early exit inside the `processEntities` check:

```javascript
const replaceEntitiesValue = function(val){
  if(this.options.processEntities){
    // Early exit if no ampersand (all entities start with &)
    if(val.indexOf('&') === -1) return val;

    // ... existing regex replacement code unchanged
  }
  return val;
}
```

**Impact:** When entity processing is enabled but text has no `&`:
- **Before:** Runs 4+ regex replacements per text node
- **After:** One `indexOf` check, immediate return
- **Result:** 15-28% faster for plain text

### Summary

Simple optimization with significant real-world impact. Most XML text nodes don't contain entities, but many parsers enable `processEntities` for safety. This change avoids unnecessary regex work in the common case. All 287 tests pass - fully backward compatible.
