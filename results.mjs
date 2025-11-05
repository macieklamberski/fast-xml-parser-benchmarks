import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const ITEMS = [10, 20, 50, 100]

const results = {}
const resultsDir = './results'

try {
  const files = readdirSync(resultsDir)

  for (const file of files) {
    if (file.endsWith('.json')) {
      const match = file.match(/bench_items(\d+)\.json/)

      if (match) {
        const items = parseInt(match[1])
        const data = JSON.parse(readFileSync(join(resultsDir, file), 'utf-8'))

        results[items] = {
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
  console.log('='.repeat(75))
  console.log(title)
  console.log('='.repeat(75))
  console.log()
}

printTableHeader('Speedup (Original / Optimized)')

let header = 'Items |'
for (const items of ITEMS) {
  header += ` ${items.toString().padStart(10)} |`
}
console.log(header)

let row = 'Speed |'
for (const items of ITEMS) {
  const value = results[items]
  if (value) {
    row += ` ${`${(value.original / value.optimized).toFixed(2)}x`.padStart(10)} |`
  } else {
    row += ` ${'-'.padStart(10)} |`
  }
}
console.log(row)

console.log()
