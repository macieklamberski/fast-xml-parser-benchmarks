export function generateFeedXml(itemCount = 50, withEntities = false) {
	const items = []

	for (let i = 0; i < itemCount; i++) {
		const description = withEntities
			? `Description &lt;with&gt; &amp; &quot;entities&quot; for episode ${i}`
			: `Description for episode ${i}`
		const summary = withEntities
			? `Summary &lt;with&gt; &amp; &quot;entities&quot; ${i}`
			: `Summary ${i}`

		items.push(`
      <item>
        <title>Episode ${i}</title>
        <link>https://example.com/episode-${i}</link>
        <description>${description}</description>
        <author>author@example.com</author>
        <category>Technology</category>
        <comments>https://example.com/comments-${i}</comments>
        <enclosure url="https://example.com/audio-${i}.mp3" length="12345678" type="audio/mpeg"/>
        <guid isPermaLink="true">https://example.com/episode-${i}</guid>
        <pubDate>Mon, 01 Jan 2025 0${i % 10}:00:00 GMT</pubDate>
        <content:encoded><![CDATA[Full content for episode ${i}]]></content:encoded>
        <itunes:author>John Doe</itunes:author>
        <itunes:subtitle>Subtitle ${i}</itunes:subtitle>
        <itunes:summary>${summary}</itunes:summary>
        <itunes:duration>3600</itunes:duration>
      </item>
    `)
	}

	let xml = `
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

export function generateStopNodes(count) {
	const allStopNodes = [
		// Wildcard patterns - match tag at any level
		'*.title',
		'*.link',
		'*.description',
		'*.author',
		'*.category',
		'*.guid',
		'*.pubDate',
		'*.image',
		'*.enclosure',
		'*.comments',
		// Exact path matches
		'rss.channel.language',
		'rss.channel.copyright',
		'rss.channel.managingEditor',
		'rss.channel.webMaster',
		'rss.channel.lastBuildDate',
		'rss.channel.generator',
		'rss.channel.docs',
		'rss.channel.cloud',
		'rss.channel.ttl',
		'rss.channel.image.url',
		'rss.channel.image.width',
		'rss.channel.image.height',
		'rss.channel.rating',
		'rss.channel.textinput.title',
		'rss.channel.textinput.description',
		'rss.channel.textinput.name',
		'rss.channel.textinput.link',
		'rss.channel.skiphours.hour',
		'rss.channel.skipdays.day',
		'rss.channel.item.source',
		// Namespace stopNodes with wildcards
		'*.itunes:author',
		'*.itunes:subtitle',
		'*.itunes:summary',
		'*.itunes:duration',
		'*.itunes:explicit',
		'*.content:encoded',
		// Exact namespace paths
		'rss.channel.itunes:owner.itunes:name',
		'rss.channel.itunes:owner.itunes:email',
		'rss.channel.itunes:category',
		'rss.channel.item.itunes:episodeType',
		'rss.channel.item.itunes:season',
		'rss.channel.item.itunes:episode',
		// More wildcards for podcast namespace
		'*.podcast:transcript',
		'*.podcast:chapters',
		'*.podcast:soundbite',
		'*.podcast:person',
		'*.podcast:location',
		'*.podcast:season',
		'*.podcast:episode',
		// Exact podcast paths
		'rss.channel.podcast:locked',
		'rss.channel.podcast:funding',
		'rss.channel.podcast:guid',
		// Dublin Core with wildcards
		'*.dc:creator',
		'*.dc:rights',
		'*.dc:date',
		'*.dc:subject',
		// Exact DC paths
		'rss.channel.dc:publisher',
		// Media namespace wildcards
		'*.media:thumbnail',
		'*.media:content',
		'*.media:description',
		'*.media:keywords',
		// Other namespaces
		'rss.channel.atom:link',
		'rss.channel.sy:updatePeriod',
		'rss.channel.sy:updateFrequency',
		'rss.channel.sy:updateBase',
		'*.georss:point',
		'*.georss:featurename',
		'*.slash:comments',
		'*.wfw:commentRss',
		'rss.channel.item.thr:in-reply-to',
		'*.dcterms:created',
		'*.dcterms:modified',
		// Add more exact paths to reach desired count
		'rss.channel.item.podcast:locked',
		'rss.channel.item.podcast:funding',
		'rss.channel.item.podcast:guid',
		'rss.channel.item.lastBuildDate',
		'rss.channel.item.managingEditor',
		'rss.channel.item.webMaster',
		'rss.channel.item.generator',
		'rss.channel.item.dc:publisher',
		'rss.channel.item.atom:link',
		'rss.channel.item.sy:updatePeriod',
		'rss.channel.item.sy:updateFrequency',
		'rss.channel.item.sy:updateBase',
	]

	return allStopNodes.slice(0, Math.min(count, allStopNodes.length))
}
