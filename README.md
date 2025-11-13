# fast-xml-parser Benchmarks

Collection of benchmarks for performance and memory optimizations for [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser).

## Memory Optimizations

- **[mem/line-ending-normalization](https://github.com/macieklamberski/fast-xml-parser-benchmarks/tree/mem/line-ending-normalization)** - mem: Skip line ending normalization for Unix files (M0 - Baseline)

## Performance Optimizations

- **[perf/optimize-wildcard-stopnodes](https://github.com/macieklamberski/fast-xml-parser-benchmarks/tree/perf/optimize-wildcard-stopnodes)** - perf: Use Set for stopNodes lookup O(1) instead of array iteration O(n) ([PR #769](https://github.com/NaturalIntelligence/fast-xml-parser/pull/769))
- **[perf/entity-replacement-early-exit](https://github.com/macieklamberski/fast-xml-parser-benchmarks/tree/perf/entity-replacement-early-exit)** - perf: Add early exit to entity replacement (PR TBD)
- **[perf/getallmatches-array-copy](https://github.com/macieklamberski/fast-xml-parser-benchmarks/tree/perf/getallmatches-array-copy)** - perf: Replace manual loop with spread operator in getAllMatches (PR TBD)
- **[perf/unpairedtags-set-optimization](https://github.com/macieklamberski/fast-xml-parser-benchmarks/tree/perf/unpairedtags-set-optimization)** - perf: Use Set for unpairedTags lookup instead of indexOf (PR TBD)
