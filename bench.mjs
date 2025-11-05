import { XMLParser as OriginalParser } from 'fast-xml-parser'
import { XMLParser as OptimizedParser } from 'fast-xml-parser-optimized'
import { generateHtmlWithUnpairedTags } from './utils.mjs'

const [, , parserType, itemsCount] = process.argv
const Parser = parserType === 'original' ? OriginalParser : OptimizedParser
const iterations = 100

const htmlData = generateHtmlWithUnpairedTags(Number(itemsCount))
const parser = new Parser({
  ignoreAttributes: false,
  unpairedTags: ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']
})

for (let i = 0; i < iterations; i++) {
  parser.parse(htmlData)
}
