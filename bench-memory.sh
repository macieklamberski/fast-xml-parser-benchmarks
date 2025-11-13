#!/bin/bash

ITEMS=(10 20 50 100)

mkdir -p results

echo "Running memory benchmarks..."
echo ""

for items in "${ITEMS[@]}"; do
	echo "Items: $items"

	# Run each 5 times and average
	orig_heap=0
	opt_heap=0

	for run in {1..5}; do
		orig=$(node --expose-gc bench-memory.mjs original $items)
		opt=$(node --expose-gc bench-memory.mjs optimized $items)

		orig_val=$(echo $orig | node -e "const data=JSON.parse(require('fs').readFileSync(0,'utf-8')); console.log(data.peakHeapMB)")
		opt_val=$(echo $opt | node -e "const data=JSON.parse(require('fs').readFileSync(0,'utf-8')); console.log(data.peakHeapMB)")

		orig_heap=$(echo "$orig_heap + $orig_val" | bc)
		opt_heap=$(echo "$opt_heap + $opt_val" | bc)
	done

	# Calculate averages
	orig_avg=$(echo "scale=2; $orig_heap / 5" | bc)
	opt_avg=$(echo "scale=2; $opt_heap / 5" | bc)
	reduction=$(echo "scale=2; (1 - $opt_avg / $orig_avg) * 100" | bc)

	echo "  Original:  ${orig_avg} MB"
	echo "  Optimized: ${opt_avg} MB"
	echo "  Reduction: ${reduction}%"
	echo ""
done
