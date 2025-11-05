#!/bin/bash

ENTITY_TYPES=("with-entities" "without-entities")
ITEMS=(10 20 50 100)

mkdir -p results

for entityType in "${ENTITY_TYPES[@]}"; do
  for items in "${ITEMS[@]}"; do
    hyperfine \
      --warmup 3 \
      --runs 10 \
      --export-json "results/bench_${entityType}_${items}.json" \
      --command-name "Original ($entityType, items=$items)" \
      --command-name "Optimized ($entityType, items=$items)" \
      "node bench.mjs original $entityType $items" \
      "node bench.mjs optimized $entityType $items"
  done
done

node results.mjs
