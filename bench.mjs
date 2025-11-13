import { XMLParser as OriginalParser } from 'fast-xml-parser'
import { XMLParser as OptimizedParser } from 'fast-xml-parser-optimized'
import { generateFeedXml } from './utils.mjs'

const [, , parserType, itemsCount] = process.argv
const Parser = parserType === 'original' ? OriginalParser : OptimizedParser
const iterations = 100

const xmlData = generateFeedXml(Number(itemsCount))
const parser = new Parser()

for (let i = 0; i < iterations; i++) {
	parser.parse(xmlData)
}
