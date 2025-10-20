import { XMLParser as OriginalParser } from 'fast-xml-parser'
import { XMLParser as OptimizedParser } from 'fast-xml-parser-optimized'
import { generateFeedXml, generateStopNodes } from './utils.mjs'

const [, , parserType, stopNodesCount, itemsCount] = process.argv
const Parser = parserType === 'original' ? OriginalParser : OptimizedParser
const iterations = 100

const xmlData = generateFeedXml(Number(itemsCount))
const stopNodes = generateStopNodes(Number(stopNodesCount))
const parser = new Parser({ stopNodes: stopNodes })

for (let i = 0; i < iterations; i++) {
  parser.parse(xmlData)
}
