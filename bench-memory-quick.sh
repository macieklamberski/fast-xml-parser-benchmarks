#!/bin/bash
# Quick memory test - single run per scenario

set -e

SCENARIOS=("rss-small" "rss-10mb" "rss-50mb")

echo "Testing peak memory (single run)..."
echo ""

for scenario in "${SCENARIOS[@]}"; do
  orig=$(bun --expose-gc bench-memory-peak.mjs original "$scenario" 2>/dev/null)
  opt=$(bun --expose-gc bench-memory-peak.mjs optimized "$scenario" 2>/dev/null)

  orig_peak=$(echo "$orig" | awk '{print $2}')
  opt_peak=$(echo "$opt" | awk '{print $2}')

  reduction=$(echo "scale=1; (($orig_peak - $opt_peak) / $orig_peak) * 100" | bc)

  echo "$scenario: Original=${orig_peak}MB, Optimized=${opt_peak}MB, Reduction=${reduction}%"
done
