import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const SCENARIOS = ['rss-small', 'rss-10mb', 'rss-50mb']

const results = {}
const resultsDir = './results'

try {
	const files = readdirSync(resultsDir)

	for (const file of files) {
		if (file.startsWith('bench_') && file.endsWith('.json')) {
			const match = file.match(/bench_(.+)\.json/)

			if (match) {
				const scenario = match[1]
				if (!SCENARIOS.includes(scenario)) continue

				const data = JSON.parse(readFileSync(join(resultsDir, file), 'utf-8'))

				results[scenario] = {
					original: data.results[0].mean * 1000,
					optimized: data.results[1].mean * 1000,
				}
			}
		}
	}
} catch (error) {
	console.error('Error reading results:', error.message)
	process.exit(1)
}

function printTableHeader(title) {
	console.log()
	console.log('='.repeat(85))
	console.log(title)
	console.log('='.repeat(85))
	console.log()
}

printTableHeader('Comprehensive Benchmark Results (Speedup: Original / Optimized)')

let header = 'Scenario      |'

for (const scenario of SCENARIOS) {
	header += ` ${scenario.padEnd(14)} |`
}

console.log(header)

let row = '              |'

for (const scenario of SCENARIOS) {
	const value = results[scenario]

	if (value) {
		const speedup = (value.original / value.optimized).toFixed(2)
		const symbol = speedup >= 1.0 ? '✓' : '✗'
		row += ` ${symbol} ${`${speedup}x`.padEnd(13)} |`
	} else {
		row += ` ${'-'.padEnd(14)} |`
	}
}

console.log(row)

console.log()
console.log('✓ = faster than original, ✗ = slower than original')
console.log()

// Detailed breakdown
for (const scenario of SCENARIOS) {
	const value = results[scenario]
	if (!value) continue

	const speedup = (value.original / value.optimized).toFixed(2)
	const improvement = ((value.original / value.optimized - 1) * 100).toFixed(1)
	const status = speedup >= 1.0 ? 'FASTER' : 'SLOWER'
	const symbol = speedup >= 1.0 ? '✓' : '✗'

	console.log(`${symbol} ${scenario.toUpperCase()}: ${speedup}x (${improvement}% ${status})`)
	console.log(`  Original:  ${value.original.toFixed(1)}ms`)
	console.log(`  Optimized: ${value.optimized.toFixed(1)}ms`)
	console.log()
}
