# Optimization Implementation Plan

## Workflow

1. ✅ Review optimization plans (done)
2. Choose which optimization to work on
3. Suggest branch name based on the optimization
4. **IMPORTANT:** Always branch from `master` in `../fast-xml-parser`
5. Implement optimization in `../fast-xml-parser`
6. Create/adapt benchmarks to test the optimization
7. Verify it works and shows improvement
8. Create new branch in `fast-xml-parser-benchmarks` with:
   - Benchmark results
   - README explaining the optimization
   - Same structure as current `perf/optimize-wildcard-stopnodes` branch
9. Add new branch to main README

---

## Available Optimizations

### HIGH Priority (Best ROI)

**#1: unpairedTags Set Optimization**
- **Expected gain:** 10-30% when unpairedTags used
- **Complexity:** Low (mirrors existing stopNodes optimization)
- **Branch:** `perf/unpairedtags-set-optimization`
- **What:** Convert O(n) `Array.indexOf()` to O(1) `Set.has()` for unpaired tags like `<br>`, `<img>`, etc.
- **File:** `../fast-xml-parser/optimizations/01-unpairedtags-set-optimization.md`

**#2: Entity Replacement Early Exit**
- **Expected gain:** 20-40% with entities, 5-10% without
- **Complexity:** Low (add early exits)
- **Branch:** `perf/entity-replacement-early-exit`
- **What:** Skip expensive regex replacements when no `&` character present
- **File:** `../fast-xml-parser/optimizations/02-entity-replacement-early-exit.md`

**#3: String Concatenation Optimization**
- **Expected gain:** 15-25% for large text nodes
- **Complexity:** **HIGH** (main loop refactoring)
- **Branch:** `perf/string-concatenation-optimization`
- **What:** Replace `textData += char` with substring extraction
- **File:** `../fast-xml-parser/optimizations/03-string-concatenation-optimization.md`

**#4: Builder Entity Early Exit**
- **Expected gain:** 10-20% for plain text building
- **Complexity:** Low (add early exits)
- **Branch:** `perf/builder-entity-early-exit`
- **What:** Skip entity escaping when no special chars (`<`, `>`, `&`, etc.)
- **File:** `../fast-xml-parser/optimizations/04-builder-entity-early-exit.md`

### MEDIUM Priority

**#5: Redundant Trim Operations**
- **Expected gain:** 5-10% for XML with many text nodes
- **Complexity:** Medium (careful logic changes)
- **Branch:** `perf/redundant-trim-operations`
- **What:** Remove duplicate `trim()` calls in text processing
- **File:** `../fast-xml-parser/optimizations/05-redundant-trim-operations.md`

**#6: resolveNameSpace Cache**
- **Expected gain:** 3-7% for XML with attributes
- **Complexity:** Low (conditional method assignment)
- **Branch:** `perf/resolve-namespace-cache`
- **What:** Bypass function call overhead when `removeNSPrefix` is false
- **File:** `../fast-xml-parser/optimizations/06-resolve-namespace-cache.md`

**#7: getAllMatches Array Copy**
- **Expected gain:** 5-10% for attribute parsing
- **Complexity:** Low (replace loop with spread operator)
- **Branch:** `perf/getallmatches-array-copy`
- **What:** Use `[...match]` instead of manual array copying
- **File:** `../fast-xml-parser/optimizations/07-getallmatches-array-copy.md`

### LOW Priority

**#8: substr to substring**
- **Expected gain:** 2-5%
- **Complexity:** Medium (many replacements, easy to make off-by-one errors)
- **Branch:** `perf/substr-to-substring`
- **What:** Replace deprecated `substr()` with modern `substring()`
- **File:** `../fast-xml-parser/optimizations/08-substr-to-substring.md`

**#9: Object.keys Empty Check**
- **Expected gain:** 3-8% for deeply nested XML
- **Complexity:** Low (helper functions)
- **Branch:** `perf/object-keys-empty-check`
- **What:** Replace `Object.keys(obj).length === 0` with `for...in` loop
- **File:** `../fast-xml-parser/optimizations/09-object-keys-empty-check.md`

**#10: Builder stopNodes Set**
- **Expected gain:** 10-20% when stopNodes used in builder
- **Complexity:** Low-Medium (mirrors parser optimization)
- **Branch:** `perf/builder-stopnodes-set`
- **What:** Convert builder stopNodes to Set-based lookup
- **File:** `../fast-xml-parser/optimizations/10-builder-stopnodes-set.md`

---

## Recommendations

**Easiest wins:** #1, #2, #4, #7 (all low complexity, high gain)

**Best single optimization:** #2 (Entity Early Exit - 20-40% gain, low complexity)

**Avoid for now:** #3 (too complex, refactors main loop)
