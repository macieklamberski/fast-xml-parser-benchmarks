import { XMLParser as OriginalParser } from 'fast-xml-parser'
import { XMLParser as OptimizedParser } from 'fast-xml-parser-optimized'
import { generateFeedXml } from './utils.mjs'

const [, , parserType, hasEntities, itemsCount] = process.argv
const Parser = parserType === 'original' ? OriginalParser : OptimizedParser
const iterations = 100

const withEntities = hasEntities === 'with-entities'
const xmlData = generateFeedXml(Number(itemsCount), withEntities)
const parser = new Parser({
  processEntities: true,
  htmlEntities: true
})

for (let i = 0; i < iterations; i++) {
  parser.parse(xmlData)
}
