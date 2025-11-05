#!/bin/bash

ITEMS=(10 20 50 100)

mkdir -p results

for items in "${ITEMS[@]}"; do
  hyperfine \
    --warmup 3 \
    --runs 10 \
    --export-json "results/bench_items${items}.json" \
    --command-name "Original (items=$items)" \
    --command-name "Optimized (items=$items)" \
    "node bench.mjs original $items" \
    "node bench.mjs optimized $items"
done

node results.mjs
