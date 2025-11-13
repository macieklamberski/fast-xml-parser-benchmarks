import { XMLParser as OriginalParser } from 'fast-xml-parser'
import { XMLParser as OptimizedParser } from 'fast-xml-parser-optimized'
import { generateFeedXml } from './utils-large.mjs'

const [, , parserType, itemsCount] = process.argv
const Parser = parserType === 'original' ? OriginalParser : OptimizedParser
const iterations = 10 // Fewer iterations for large files

const xmlData = generateFeedXml(Number(itemsCount))
const parser = new Parser()

console.error(`XML size: ${(xmlData.length / 1024 / 1024).toFixed(2)} MB`)

for (let i = 0; i < iterations; i++) {
	parser.parse(xmlData)
}
