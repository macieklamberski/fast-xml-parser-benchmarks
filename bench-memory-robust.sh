#!/bin/bash
# Robust memory testing with 10 runs per scenario for stable averages

set -e

SCENARIOS=("rss-small" "rss-10mb" "rss-50mb")
RUNS=10

echo "Running robust memory benchmarks ($RUNS runs per scenario)..."
echo ""

for scenario in "${SCENARIOS[@]}"; do
  echo "Testing $scenario..."

  orig_sum=0
  opt_sum=0

  for run in $(seq 1 $RUNS); do
    # Original
    orig_peak=$(bun --expose-gc bench-memory-peak.mjs original "$scenario" 2>/dev/null | awk '{print $2}')
    orig_sum=$(echo "$orig_sum + $orig_peak" | bc)

    # Optimized
    opt_peak=$(bun --expose-gc bench-memory-peak.mjs optimized "$scenario" 2>/dev/null | awk '{print $2}')
    opt_sum=$(echo "$opt_sum + $opt_peak" | bc)

    echo -n "."
  done

  echo ""

  # Calculate averages
  orig_avg=$(echo "scale=2; $orig_sum / $RUNS" | bc)
  opt_avg=$(echo "scale=2; $opt_sum / $RUNS" | bc)

  # Calculate reduction
  reduction=$(echo "scale=1; (($orig_avg - $opt_avg) / $orig_avg) * 100" | bc)

  echo "$scenario: Original=${orig_avg}MB, Optimized=${opt_avg}MB, Reduction=${reduction}%"
  echo ""
done
