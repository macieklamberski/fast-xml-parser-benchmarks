import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const ENTITY_TYPES = ['with-entities', 'without-entities']
const ITEMS = [10, 20, 50, 100]

const results = {}
const resultsDir = './results'

try {
  const files = readdirSync(resultsDir)

  for (const file of files) {
    if (file.endsWith('.json')) {
      const match = file.match(/bench_(with|without)-entities_(\d+)\.json/)

      if (match) {
        const entityType = match[1] === 'with' ? 'with-entities' : 'without-entities'
        const items = parseInt(match[2])
        const data = JSON.parse(readFileSync(join(resultsDir, file), 'utf-8'))

        if (!results[entityType]) {
          results[entityType] = {}
        }
        results[entityType][items] = {
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

  let header = 'Entity Type \\ Items |'

  for (const items of ITEMS) {
    header += ` ${items.toString().padStart(10)} |`
  }

  console.log(header)

  for (const entityType of ENTITY_TYPES) {
    const label = entityType === 'with-entities' ? 'With Entities' : 'Without'
    let row = `${label.padStart(19)} |`

    for (const items of ITEMS) {
      const value = results[entityType]?.[items]

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
printMatrix('Speedup (Original / Optimized)', (v) => `${(v.original / v.optimized).toFixed(2)}x`)
