#!/bin/bash

for size in 0 10 30 65 100; do
  hyperfine \
    --warmup 3 \
    --runs 20 \
    "node bench.mjs original $size" \
    "node bench.mjs optimized $size" \
    --command-name "Original ($size stopNodes)" \
    --command-name "Optimized ($size stopNodes)"
  echo ""
done
