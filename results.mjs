import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const ATTR_COUNTS = [0, 5, 10, 15]
const ITEMS = [10, 20, 50, 100]

const results = {}
const resultsDir = './results'

try {
  const files = readdirSync(resultsDir)

  for (const file of files) {
    if (file.endsWith('.json')) {
      const match = file.match(/bench_attrs(\d+)_items(\d+)\.json/)

      if (match) {
        const attrCount = parseInt(match[1])
        const items = parseInt(match[2])
        const data = JSON.parse(readFileSync(join(resultsDir, file), 'utf-8'))

        if (!results[attrCount]) {
          results[attrCount] = {}
        }
        results[attrCount][items] = {
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

function printMatrix(title, valueExtractor) {
  printTableHeader(title)

  let header = 'Attributes \\ Items |'

  for (const items of ITEMS) {
    header += ` ${items.toString().padStart(10)} |`
  }

  console.log(header)

  for (const attrCount of ATTR_COUNTS) {
    const label = attrCount === 0 ? 'No attrs' : `${attrCount} attrs`
    let row = `${label.padStart(21)} |`

    for (const items of ITEMS) {
      const value = results[attrCount]?.[items]

      if (value) {
        row += ` ${valueExtractor(value).padStart(10)} |`
      } else {
        row += ` ${'-'.padStart(10)} |`
      }
    }

    console.log(row)
  }
}

printMatrix('Speedup (Original / Optimized)', (v) => `${(v.original / v.optimized).toFixed(2)}x`)

console.log()
