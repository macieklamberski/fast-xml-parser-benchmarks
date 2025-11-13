import { XMLParser as OriginalParser } from 'fast-xml-parser'
import { XMLParser as OptimizedParser } from 'fast-xml-parser-optimized'
import { generateFeedXml } from './utils.mjs'

const [, , parserType, itemsCount] = process.argv
const Parser = parserType === 'original' ? OriginalParser : OptimizedParser
const iterations = 100

const xmlData = generateFeedXml(Number(itemsCount))

// Force GC if available
if (global.gc) {
	global.gc()
}

const memBefore = process.memoryUsage()

const parser = new Parser()
for (let i = 0; i < iterations; i++) {
	parser.parse(xmlData)
}

// Force GC if available
if (global.gc) {
	global.gc()
}

const memAfter = process.memoryUsage()

// Calculate memory deltas in MB
const heapUsedMB = (memAfter.heapUsed - memBefore.heapUsed) / 1024 / 1024
const externalMB = (memAfter.external - memBefore.external) / 1024 / 1024
const rssM = (memAfter.rss - memBefore.rss) / 1024 / 1024

console.log(JSON.stringify({
	type: parserType,
	items: itemsCount,
	heapUsedMB: heapUsedMB.toFixed(2),
	externalMB: externalMB.toFixed(2),
	rssMB: rssM.toFixed(2),
	peakHeapMB: (memAfter.heapUsed / 1024 / 1024).toFixed(2)
}))
