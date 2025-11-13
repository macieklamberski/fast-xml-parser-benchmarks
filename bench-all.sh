#!/bin/bash

# Comprehensive benchmark: tests small RSS + 10MB + 50MB feeds
SCENARIOS=("rss-small" "rss-10mb" "rss-50mb")

mkdir -p results

for scenario in "${SCENARIOS[@]}"; do
	echo "Benchmarking: $scenario"
	hyperfine \
		--warmup 1 \
		--runs 5 \
		--export-json "results/bench_${scenario}.json" \
		--command-name "Original ($scenario)" \
		--command-name "Optimized ($scenario)" \
		"node bench-comprehensive.mjs original $scenario" \
		"node bench-comprehensive.mjs optimized $scenario"
done

node results-all.mjs
