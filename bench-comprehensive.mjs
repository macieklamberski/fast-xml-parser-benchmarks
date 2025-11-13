import { XMLParser as OriginalParser } from 'fast-xml-parser'
import { XMLParser as OptimizedParser } from 'fast-xml-parser-optimized'
import { generateFeedXml } from './utils-comprehensive.mjs'

const [, , parserType, scenario] = process.argv
const Parser = parserType === 'original' ? OriginalParser : OptimizedParser

// Test scenarios:
// rss-small: Standard RSS feed (100 items, small text)
// rss-10mb: 100 items with ~100KB text each = ~10MB
// rss-50mb: 100 items with ~500KB text each = ~50MB
const scenarios = {
	'rss-small': { items: 100, textSizeKB: 0.05, iterations: 100 },
	'rss-10mb': { items: 100, textSizeKB: 100, iterations: 10 },
	'rss-50mb': { items: 100, textSizeKB: 500, iterations: 3 },
}

const config = scenarios[scenario]
if (!config) {
	console.error(`Unknown scenario: ${scenario}`)
	console.error(`Available: ${Object.keys(scenarios).join(', ')}`)
	process.exit(1)
}

const xmlData = generateFeedXml(config.items, config.textSizeKB)
const parser = new Parser()

const sizeMB = (xmlData.length / 1024 / 1024).toFixed(2)
console.error(`Scenario: ${scenario}, Size: ${sizeMB} MB, Iterations: ${config.iterations}`)

for (let i = 0; i < config.iterations; i++) {
	parser.parse(xmlData)
}
