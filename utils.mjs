export function generateHtmlWithUnpairedTags(itemCount = 100) {
	const items = []

	for (let i = 0; i < itemCount; i++) {
		items.push(`
    <div>
      <p>Paragraph ${i}</p>
      <br>
      <img src="image${i}.jpg">
      <hr>
      <input type="text">
      <meta name="test${i}">
      <link rel="stylesheet" href="style${i}.css">
    </div>`)
	}

	return `<!DOCTYPE html>
<html>
  <head>
    <title>Test Page</title>
  </head>
  <body>
    ${items.join('')}
  </body>
</html>`
}
