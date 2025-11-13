export function generateFeedXml(itemCount = 50) {
	const items = []

	// Generate 50KB of text per item to test large text node optimization
	const largeText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(1000)

	for (let i = 0; i < itemCount; i++) {
		items.push(`
      <item>
        <title>Episode ${i}</title>
        <link>https://example.com/episode-${i}</link>
        <description>${largeText}</description>
        <author>author@example.com</author>
        <category>Technology</category>
        <comments>https://example.com/comments-${i}</comments>
        <enclosure url="https://example.com/audio-${i}.mp3" length="12345678" type="audio/mpeg"/>
        <guid isPermaLink="true">https://example.com/episode-${i}</guid>
        <pubDate>Mon, 01 Jan 2025 0${i % 10}:00:00 GMT</pubDate>
        <content:encoded><![CDATA[${largeText}]]></content:encoded>
        <itunes:author>John Doe</itunes:author>
        <itunes:subtitle>Subtitle ${i}</itunes:subtitle>
        <itunes:summary>Summary ${i}</itunes:summary>
        <itunes:duration>3600</itunes:duration>
      </item>
    `)
	}

	const xml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
      <channel>
        <title>Example Podcast</title>
        <link>https://example.com</link>
        <description>An example podcast feed</description>
        <language>en-us</language>
        <copyright>Copyright 2025</copyright>
        <managingEditor>editor@example.com</managingEditor>
        <webMaster>webmaster@example.com</webMaster>
        <pubDate>Mon, 01 Jan 2025 00:00:00 GMT</pubDate>
        <lastBuildDate>Mon, 01 Jan 2025 00:00:00 GMT</lastBuildDate>
        <generator>Test Generator</generator>
        <ttl>60</ttl>
        <image>
          <url>https://example.com/image.jpg</url>
          <title>Example Image</title>
          <link>https://example.com</link>
        </image>
        <itunes:author>John Doe</itunes:author>
        <itunes:summary>Example summary</itunes:summary>
				${items.join('')}
      </channel>
    </rss>
	`

	return xml
}
