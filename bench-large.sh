#!/bin/bash

# Test with documents that are ~50MB total (100 items × ~500KB each)
ITEMS=(10 20 50 100)

mkdir -p results

for items in "${ITEMS[@]}"; do
	hyperfine \
		--warmup 1 \
		--runs 5 \
		--export-json "results/bench_large_${items}.json" \
		--command-name "Original (items=$items)" \
		--command-name "Optimized (items=$items)" \
		"node bench-large.mjs original $items" \
		"node bench-large.mjs optimized $items"
done

node results-large.mjs
