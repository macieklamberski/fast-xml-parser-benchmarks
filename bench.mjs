import { XMLParser as OriginalParser } from 'fast-xml-parser'
import { XMLParser as OptimizedParser } from 'fast-xml-parser-optimized'
import { generateFeedXml } from './utils.mjs'

const [, , parserType, lineEndingType, itemsCount] = process.argv
const Parser = parserType === 'original' ? OriginalParser : OptimizedParser
const iterations = 100

// Map line ending types to actual characters
const lineEndingMap = {
	'unix': '\n',
	'windows': '\r\n',
	'mac': '\r'
}

const lineEnding = lineEndingMap[lineEndingType] || '\n'
const xmlData = generateFeedXml(Number(itemsCount), lineEnding)
const parser = new Parser()

for (let i = 0; i < iterations; i++) {
	parser.parse(xmlData)
}
