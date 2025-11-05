export function generateXmlWithAttributes(itemCount = 100, attrCount = 10) {
	const items = []

	for (let i = 0; i < itemCount; i++) {
		const attrs = []
		for (let j = 0; j < attrCount; j++) {
			attrs.push(`attr${j}="value${j}"`)
		}
		attrs.push(`id="${i}"`)
		attrs.push(`name="Item ${i}"`)
		attrs.push(`type="test"`)
		attrs.push(`status="active"`)
		attrs.push(`category="cat${i % 10}"`)

		items.push(`
    <item ${attrs.join(' ')}>
      Content ${i}
    </item>`)
	}

	return `<?xml version="1.0" encoding="UTF-8"?>
<root>
  ${items.join('')}
</root>`
}
