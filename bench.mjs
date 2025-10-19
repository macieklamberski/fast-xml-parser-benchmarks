import { XMLParser as OriginalParser } from 'fast-xml-parser'
import { XMLParser as OptimizedParser } from 'fast-xml-parser-optimized'
import { generateFeedXml, generateStopNodes } from './utils.mjs'

const [, , parserType, stopNodesCount] = process.argv

if (!parserType || !stopNodesCount) {
  console.error('Usage: node bench-cli.mjs <original|optimized> <stopNodesCount>')
  process.exit(1)
}

const Parser = parserType === 'original' ? OriginalParser : OptimizedParser
const xmlData = generateFeedXml(50)
const stopNodes = generateStopNodes(Number(stopNodesCount))
const parser = new Parser({ stopNodes: stopNodes })
const iterations = 100

for (let i = 0; i < iterations; i++) {
  parser.parse(xmlData)
}
