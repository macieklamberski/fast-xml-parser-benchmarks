import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const STOP_NODES = [0, 10, 25, 50, 100]
const ITEMS = [10, 20, 50, 100]

const results = {}
const resultsDir = './results'

try {
  const files = readdirSync(resultsDir)

  for (const file of files) {
    if (file.endsWith('.json')) {
      const match = file.match(/bench_(\d+)_(\d+)\.json/)

      if (match) {
        const stopNodes = parseInt(match[1])
        const items = parseInt(match[2])
        const data = JSON.parse(readFileSync(join(resultsDir, file), 'utf-8'))

        if (!results[stopNodes]) {
          results[stopNodes] = {}
        }
        results[stopNodes][items] = {
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

function formatSpeedup(original, optimized) {
  const speedup = original / optimized
  const color = speedup > 1 ? '\x1b[32m' : '\x1b[31m'
  const reset = '\x1b[0m'
  return `${color}${speedup.toFixed(2)}x${reset}`
}

function printTableHeader(title) {
  console.log()
  console.log('='.repeat(71))
  console.log(title)
  console.log('='.repeat(71))
  console.log()
}

function printMatrix(title, valueExtractor) {
  printTableHeader(title)

  let header = 'StopNodes \\ Items |'

  for (const items of ITEMS) {
    header += ` ${items.toString().padStart(10)} |`
  }

  console.log(header)

  for (const stopNodes of STOP_NODES) {
    let row = `${stopNodes.toString().padStart(17)} |`

    for (const items of ITEMS) {
      const value = results[stopNodes]?.[items]

      if (value) {
        row += ` ${valueExtractor(value).padStart(10)} |`
      } else {
        row += ` ${'-'.padStart(10)} |`
      }
    }

    console.log(row)
  }
}

printMatrix('Original Parser - Execution Time', (v) => formatTime(v.original))
printMatrix('Optimized Parser - Execution Time', (v) => formatTime(v.optimized))

printMatrix('Speedup (Original / Optimized)', (v) => {
  const speedup = v.original / v.optimized
  return `${speedup.toFixed(2)}x`
})

printTableHeader('Summary Statistics')

let totalSpeedup = 0
let count = 0
let maxSpeedup = 0
let minSpeedup = Infinity
let maxSpeedupConfig = ''
let minSpeedupConfig = ''

for (const stopNodes of STOP_NODES) {
  for (const items of ITEMS) {
    const value = results[stopNodes]?.[items]
    if (value) {
      const speedup = value.original / value.optimized
      totalSpeedup += speedup
      count++

      if (speedup > maxSpeedup) {
        maxSpeedup = speedup
        maxSpeedupConfig = `stopNodes=${stopNodes}, items=${items}`
      }
      if (speedup < minSpeedup) {
        minSpeedup = speedup
        minSpeedupConfig = `stopNodes=${stopNodes}, items=${items}`
      }
    }
  }
}

const avgSpeedup = totalSpeedup / count

console.log(`Average Speedup: ${formatSpeedup(avgSpeedup, 1)}`)
console.log(`Maximum Speedup: ${formatSpeedup(maxSpeedup, 1)} at ${maxSpeedupConfig}`)
console.log(`Minimum Speedup: ${formatSpeedup(minSpeedup, 1)} at ${minSpeedupConfig}`)
console.log()
