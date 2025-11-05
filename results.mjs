import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const HTML_ENTITIES = ['no-html-entities', 'html-entities']
const ENTITY_TYPES = ['without-entities', 'with-entities']
const ITEMS = [10, 20, 50, 100]

const results = {}
const resultsDir = './results'

try {
  const files = readdirSync(resultsDir)

  for (const file of files) {
    if (file.endsWith('.json')) {
      const match = file.match(/bench_(no-html-entities|html-entities)_(with|without)-entities_(\d+)\.json/)

      if (match) {
        const htmlEntities = match[1]
        const entityType = match[2] === 'with' ? 'with-entities' : 'without-entities'
        const items = parseInt(match[3])
        const data = JSON.parse(readFileSync(join(resultsDir, file), 'utf-8'))

        if (!results[htmlEntities]) {
          results[htmlEntities] = {}
        }
        if (!results[htmlEntities][entityType]) {
          results[htmlEntities][entityType] = {}
        }
        results[htmlEntities][entityType][items] = {
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

function printMatrix(htmlEntitiesMode, title, valueExtractor) {
  const modeLabel = htmlEntitiesMode === 'no-html-entities'
    ? 'DEFAULT (processEntities: true, htmlEntities: false)'
    : 'FULL (processEntities: true, htmlEntities: true)'

  printTableHeader(`${title} - ${modeLabel}`)

  let header = 'Entity Type \\ Items |'

  for (const items of ITEMS) {
    header += ` ${items.toString().padStart(10)} |`
  }

  console.log(header)

  for (const entityType of ENTITY_TYPES) {
    const label = entityType === 'with-entities' ? 'With Entities' : 'Without'
    let row = `${label.padStart(19)} |`

    for (const items of ITEMS) {
      const value = results[htmlEntitiesMode]?.[entityType]?.[items]

      if (value) {
        row += ` ${valueExtractor(value).padStart(10)} |`
      } else {
        row += ` ${'-'.padStart(10)} |`
      }
    }

    console.log(row)
  }
}

// Print results for each htmlEntities mode
for (const htmlEntitiesMode of HTML_ENTITIES) {
  printMatrix(htmlEntitiesMode, 'Speedup (Original / Optimized)', (v) => `${(v.original / v.optimized).toFixed(2)}x`)
}

console.log()
