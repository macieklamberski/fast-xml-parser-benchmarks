# StopNodes Optimization Benchmarks

Benchmarks comparing the original `fast-xml-parser` with an optimized version that uses O(1) Set-based stopNodes lookup instead of O(n) array iteration.

## Quick Start

```bash
npm install
./bench.sh
```

## What's Being Tested

RSS feed parsing performance with varying `stopNodes` configurations:
- **StopNodes counts**: 0, 10, 25, 50, 100
- **Feed sizes**: 10, 20, 50, 100 items
- **Pattern types**: Exact paths (`rss.channel.title`) and wildcards (`*.title`)
- **Iterations**: 100 parses per benchmark run

## Benchmark Results

```
=======================================================================
Speedup (Original / Optimized)
=======================================================================

StopNodes \ Items |         10 |         20 |         50 |        100 |
                0 |      1.01x |      1.01x |      1.01x |      1.01x |
               10 |      1.05x |      1.06x |      1.09x |      1.11x |
               25 |      1.04x |      1.13x |      1.18x |      1.20x |
               50 |      1.12x |      1.21x |      1.31x |      1.39x |
              100 |      1.17x |      1.29x |      1.41x |      1.48x |
```

## Key Findings

**Performance scales with stopNodes count:**
- **0 stopNodes**: ~1.00x (no regression at baseline)
- **10 stopNodes**: ~5-11% faster
- **25 stopNodes**: ~4-20% faster
- **50 stopNodes**: ~12-39% faster
- **100 stopNodes**: ~17-48% faster

**Original implementation degrades linearly (O(n))** as stopNodes increase, while **optimized version maintains constant performance (O(1))**.

## Optimization Explained

### The Problem

The `isItStopNode()` function is called **on every opening XML tag** during parsing. The original implementation used a `for...in` loop inside this function to check if the tag matched any stopNodes pattern - creating an O(n) performance bottleneck where n = number of stopNodes.

**Performance impact for an RSS feed with 100 items (~1,500 tags) and 100 stopNodes:**
- Function calls: 1,500 (one per opening tag)
- Loop iterations: 1,500 × 100 = **150,000 iterations**
- String comparisons: 2 per iteration = **~300,000 operations**

### The Solution

The optimization splits stopNodes into two JavaScript Sets during parser construction (one-time cost):
- **Exact matches**: Full paths like `"rss.channel.title"`
- **Wildcard matches**: Tag names extracted from patterns like `"*.title"` → `"title"`

During parsing, instead of looping through all stopNodes for every tag, the function performs two instant Set lookups to check if the current tag matches.

**Impact:** 150,000 loop iterations → 3,000 Set lookups (**~50x reduction**) for 1,500 tags with 100 stopNodes.

### Summary

JavaScript Sets provide O(1) hash-based lookups regardless of size. By preprocessing stopNodes once during construction, we eliminate repeated array iteration on every tag. Results show **5-48% faster parsing** as stopNodes increase, with **no regression** at baseline. All 458 tests pass - fully backward compatible.
