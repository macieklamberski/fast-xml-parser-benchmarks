import { XMLParser as OriginalParser } from 'fast-xml-parser'
import { XMLParser as OptimizedParser } from 'fast-xml-parser-optimized'
import { generateXmlWithAttributes } from './utils.mjs'

const [, , parserType, attrCount, itemsCount] = process.argv
const Parser = parserType === 'original' ? OriginalParser : OptimizedParser
const iterations = 100

const xmlData = generateXmlWithAttributes(Number(itemsCount), Number(attrCount))
const parser = new Parser({
  ignoreAttributes: false
})

for (let i = 0; i < iterations; i++) {
  parser.parse(xmlData)
}
