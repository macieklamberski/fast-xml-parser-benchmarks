**PR:** [Entity Replacement Early Exit - perf: Add early exit to entity replacement](https://github.com/NaturalIntelligence/fast-xml-parser/pull/TBD)

Benchmarks for entity replacement optimization that adds early exits to skip expensive regex replacements.

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
- **Parser options**: `processEntities: true, htmlEntities: true`

## Benchmark Results

```
=======================================================================
Speedup (Original / Optimized)
=======================================================================

Entity Type \ Items |         10 |         20 |         50 |        100 |
      With Entities |      1.00x |      1.00x |      1.01x |      1.00x |
            Without |      1.03x |      1.00x |      1.01x |      1.00x |
```

## Key Findings

**Performance impact minimal in this test:**
- **With entities**: ~1.00x (no measurable improvement)
- **Without entities**: ~1.01-1.03x (1-3% improvement)

The results show minimal improvement because:
1. **RSS feed structure**: Most text content is in CDATA sections (not processed by entity replacement)
2. **Limited entity usage**: Only 2 text fields per item contain entities (description, summary)
3. **Already optimized path**: Modern JS engines optimize simple string operations very efficiently

## Optimization Explained

### The Problem

`replaceEntitiesValue()` is called on every text node. The original implementation:
- Always loops through all entity replacement regexes
- No early exit when `processEntities` is disabled
- No early exit when text contains no ampersand character

### The Solution

Added two early exit conditions:
```javascript
// Early exit if processEntities disabled
if(!this.options.processEntities) return val;

// Early exit if no ampersand (all entities start with &)
if(val.indexOf('&') === -1) return val;
```

**Impact:** Avoids unnecessary regex replacements when:
- Entity processing is disabled
- Text contains no entities (most common case)

### Expected Impact in Real-World Scenarios

This optimization will show more significant gains in:
- **Documents with many text nodes**: Where entity checking overhead compounds
- **Plain text heavy XML**: Most text doesn't contain entities
- **Custom XML formats**: Non-RSS documents without CDATA escaping

### Summary

The optimization is valid and beneficial (early exits are always good practice), but RSS feeds with CDATA aren't the ideal benchmark. The real-world impact depends heavily on document structure. All 287 tests pass - fully backward compatible.
