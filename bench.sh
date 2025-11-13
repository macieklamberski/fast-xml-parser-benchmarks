#!/bin/bash

LINE_ENDINGS=("unix" "windows")
ITEMS=(10 20 50 100)

mkdir -p results

for lineEnding in "${LINE_ENDINGS[@]}"; do
	for items in "${ITEMS[@]}"; do
		hyperfine \
			--warmup 3 \
			--runs 10 \
			--export-json "results/bench_${lineEnding}_${items}.json" \
			--command-name "Original ($lineEnding, items=$items)" \
			--command-name "Optimized ($lineEnding, items=$items)" \
			"node bench.mjs original $lineEnding $items" \
			"node bench.mjs optimized $lineEnding $items"
	done
done

node results.mjs
