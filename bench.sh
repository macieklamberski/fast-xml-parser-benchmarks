#!/bin/bash

ATTR_COUNTS=(0 5 10 15)
ITEMS=(10 20 50 100)

mkdir -p results

for attrCount in "${ATTR_COUNTS[@]}"; do
  for items in "${ITEMS[@]}"; do
    hyperfine \
      --warmup 3 \
      --runs 10 \
      --export-json "results/bench_attrs${attrCount}_items${items}.json" \
      --command-name "Original (attrs=$attrCount, items=$items)" \
      --command-name "Optimized (attrs=$attrCount, items=$items)" \
      "node bench.mjs original $attrCount $items" \
      "node bench.mjs optimized $attrCount $items"
  done
done

node results.mjs
