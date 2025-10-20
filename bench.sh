#!/bin/bash

STOP_NODES=(0 10 25 50 100)
ITEMS=(10 20 50 100)

mkdir -p results

for stopNodes in "${STOP_NODES[@]}"; do
  for items in "${ITEMS[@]}"; do
    hyperfine \
      --warmup 3 \
      --runs 10 \
      --export-json "results/bench_${stopNodes}_${items}.json" \
      --command-name "Original (stopNodes=$stopNodes, items=$items)" \
      --command-name "Optimized (stopNodes=$stopNodes, items=$items)" \
      "node bench.mjs original $stopNodes $items" \
      "node bench.mjs optimized $stopNodes $items"
  done
done

node results.mjs
