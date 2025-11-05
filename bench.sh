#!/bin/bash

HTML_ENTITIES=("no-html-entities" "html-entities")
ENTITY_TYPES=("without-entities" "with-entities")
ITEMS=(10 20 50 100)

mkdir -p results

for htmlEntities in "${HTML_ENTITIES[@]}"; do
  for entityType in "${ENTITY_TYPES[@]}"; do
    for items in "${ITEMS[@]}"; do
      hyperfine \
        --warmup 3 \
        --runs 10 \
        --export-json "results/bench_${htmlEntities}_${entityType}_${items}.json" \
        --command-name "Original ($htmlEntities, $entityType, items=$items)" \
        --command-name "Optimized ($htmlEntities, $entityType, items=$items)" \
        "node bench.mjs original $htmlEntities $entityType $items" \
        "node bench.mjs optimized $htmlEntities $entityType $items"
    done
  done
done

node results.mjs
