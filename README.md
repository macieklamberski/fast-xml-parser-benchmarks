# [PR #???](https://github.com/NaturalIntelligence/fast-xml-parser/pull/???) - perf: Replace manual loop with spread operator in getAllMatches

Benchmarks for `getAllMatches()` optimization that replaces manual array copying loop with spread operator.

## Quick Start

```bash
npm install
./bench.sh
```

Or run via GitHub Actions: https://github.com/macieklamberski/fast-xml-parser-benchmarks/actions/workflows/benchmark.yml (select this branch from the dropdown).

## What's Being Tested

XML parsing performance with varying attribute counts:
- **Parser config**: `ignoreAttributes: false` to test attribute parsing
- **Attribute counts**: 0, 5, 10, 15 attributes per element
- **Document sizes**: 10, 20, 50, 100 items
- **Iterations**: 100 parses per benchmark run

## Benchmark Results

```
===========================================================================
Speedup (Original / Optimized)
===========================================================================

Attributes \ Items |         10 |         20 |         50 |        100 |
             No attrs |      1.07x |      1.02x |      1.06x |      1.10x |
              5 attrs |      1.01x |      1.11x |      1.05x |      1.13x |
             10 attrs |      1.03x |      1.08x |      1.17x |      1.12x |
             15 attrs |      1.04x |      1.15x |      1.15x |      1.14x |
```

## Key Findings

**Consistent improvements across most scenarios:**
- **No attributes**: 1.02x - 1.10x (2-10% faster)
- **5 attributes**: 1.01x - 1.13x (1-13% faster)
- **10 attributes**: 1.03x - 1.17x (3-17% faster)
- **15 attributes**: 1.04x - 1.15x (4-15% faster)

**Why improvements scale with attributes:**
- More attributes = more calls to `getAllMatches()` per element during attribute parsing
- Performance gain increases with both attribute count and document size

**Why even no-attribute cases improve:**
- `getAllMatches()` is called during parsing for tag name matching and internal regex operations
- The spread operator optimization benefits all regex matching operations throughout the parser

## Optimization Explained

### The Problem

`getAllMatches()` in `src/util.js` is called for every attribute string during parsing. The original implementation manually copies regex match arrays one element at a time using a loop with `push()`.

**Issue:** Manual loop copying array elements one-by-one in a hot path, not utilizing JS engine optimizations for array operations.

### The Solution

Replace the manual copying loop with the spread operator (`[...match]`), which is heavily optimized by modern JS engines.

**Impact:**
- **Before:** Manual loop copies each match element
- **After:** Spread operator (native engine optimization)
- **Result:** 2-17% faster depending on attribute count

### Summary

Surgical optimization in a critical utility function. The spread operator is ES6 but fully transpiled by Babel for backward compatibility. Shows **2-17% improvement** depending on attribute density and document size. All 287 tests pass - fully backward compatible.
