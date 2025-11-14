#!/bin/bash
# Measure peak memory usage for original vs optimized across all scenarios

set -e

SCENARIOS=("rss-small" "rss-10mb" "rss-50mb")

mkdir -p results

echo "Running peak memory benchmarks..."
echo ""

for scenario in "${SCENARIOS[@]}"; do
  echo "Testing $scenario..."

  # Run 5 times and take average for stability
  orig_sum=0
  opt_sum=0

  for run in {1..5}; do
    # Original - extract peak MB (2nd field)
    orig_output=$(bun --expose-gc bench-memory-peak.mjs original "$scenario" 2>/dev/null | grep "Peak:" | awk '{print $2}')
    orig_sum=$(echo "$orig_sum + $orig_output" | bc)

    # Optimized - extract peak MB (2nd field)
    opt_output=$(bun --expose-gc bench-memory-peak.mjs optimized "$scenario" 2>/dev/null | grep "Peak:" | awk '{print $2}')
    opt_sum=$(echo "$opt_sum + $opt_output" | bc)
  done

  # Calculate averages
  orig_avg=$(echo "scale=2; $orig_sum / 5" | bc)
  opt_avg=$(echo "scale=2; $opt_sum / 5" | bc)

  # Calculate reduction percentage
  reduction=$(echo "scale=2; (($orig_avg - $opt_avg) / $orig_avg) * 100" | bc)

  echo "$scenario: Original=${orig_avg}MB, Optimized=${opt_avg}MB, Reduction=${reduction}%"
  echo "$scenario,$orig_avg,$opt_avg,$reduction" >> results/memory-peak.csv
done

echo ""
echo "Results saved to results/memory-peak.csv"
