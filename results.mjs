import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const LINE_ENDINGS = ['unix', 'windows']
const ITEMS = [10, 20, 50, 100]

const results = {}
const resultsDir = './results'

try {
	const files = readdirSync(resultsDir)

	for (const file of files) {
		if (file.endsWith('.json')) {
			const match = file.match(/bench_(unix|windows)_(\d+)\.json/)

			if (match) {
				const lineEnding = match[1]
				const items = parseInt(match[2])
				const data = JSON.parse(readFileSync(join(resultsDir, file), 'utf-8'))

				if (!results[lineEnding]) {
					results[lineEnding] = {}
				}
				results[lineEnding][items] = {
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

function formatTime(ms) {
	return `${ms.toFixed(2)}ms`
}

function printTableHeader(title) {
	console.log()
	console.log('='.repeat(75))
	console.log(title)
	console.log('='.repeat(75))
	console.log()
}

printTableHeader('Speedup (Original / Optimized)')

let header = 'Line Ending \\ Items |'

for (const items of ITEMS) {
	header += ` ${items.toString().padStart(10)} |`
}

console.log(header)

for (const lineEnding of LINE_ENDINGS) {
	const label = lineEnding === 'unix' ? 'Unix' : 'Windows'
	let row = `${label.padStart(19)} |`

	for (const items of ITEMS) {
		const value = results[lineEnding]?.[items]

		if (value) {
			row += ` ${`${(value.original / value.optimized).toFixed(2)}x`.padStart(10)} |`
		} else {
			row += ` ${'-'.padStart(10)} |`
		}
	}

	console.log(row)
}

console.log()
