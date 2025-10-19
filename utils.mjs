export function generateFeedXml(itemCount = 50) {
	const items = []

	for (let i = 0; i < itemCount; i++) {
		items.push(`
      <item>
        <title>Episode ${i}</title>
        <link>https://example.com/episode-${i}</link>
        <description>Description for episode ${i}</description>
        <author>author@example.com</author>
        <category>Technology</category>
        <comments>https://example.com/comments-${i}</comments>
        <enclosure url="https://example.com/audio-${i}.mp3" length="12345678" type="audio/mpeg"/>
        <guid isPermaLink="true">https://example.com/episode-${i}</guid>
        <pubDate>Mon, 01 Jan 2025 0${i % 10}:00:00 GMT</pubDate>
        <content:encoded><![CDATA[Full content for episode ${i}]]></content:encoded>
        <itunes:author>John Doe</itunes:author>
        <itunes:subtitle>Subtitle ${i}</itunes:subtitle>
        <itunes:summary>Summary ${i}</itunes:summary>
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
		'rss.channel.title',
		'rss.channel.link',
		'rss.channel.description',
		'rss.channel.language',
		'rss.channel.copyright',
		'rss.channel.managingeditor',
		'rss.channel.webmaster',
		'rss.channel.pubdate',
		'rss.channel.lastbuilddate',
		'rss.channel.generator',
		'rss.channel.docs',
		'rss.channel.cloud',
		'rss.channel.ttl',
		'rss.channel.image.url',
		'rss.channel.image.title',
		'rss.channel.image.link',
		'rss.channel.image.width',
		'rss.channel.image.height',
		'rss.channel.rating',
		'rss.channel.textinput.title',
		'rss.channel.textinput.description',
		'rss.channel.textinput.name',
		'rss.channel.textinput.link',
		'rss.channel.skiphours.hour',
		'rss.channel.skipdays.day',
		'rss.channel.item.title',
		'rss.channel.item.link',
		'rss.channel.item.description',
		'rss.channel.item.author',
		'rss.channel.item.category',
		'rss.channel.item.comments',
		'rss.channel.item.enclosure',
		'rss.channel.item.guid',
		'rss.channel.item.pubdate',
		'rss.channel.item.source',
		// Add namespace stopNodes
		'rss.channel.itunes:author',
		'rss.channel.itunes:subtitle',
		'rss.channel.itunes:summary',
		'rss.channel.itunes:owner.itunes:name',
		'rss.channel.itunes:owner.itunes:email',
		'rss.channel.itunes:image',
		'rss.channel.itunes:category',
		'rss.channel.itunes:explicit',
		'rss.channel.item.itunes:author',
		'rss.channel.item.itunes:subtitle',
		'rss.channel.item.itunes:summary',
		'rss.channel.item.itunes:image',
		'rss.channel.item.itunes:duration',
		'rss.channel.item.itunes:explicit',
		'rss.channel.item.itunes:episodeType',
		'rss.channel.item.itunes:season',
		'rss.channel.item.itunes:episode',
		'rss.channel.item.content:encoded',
		// Add more to reach desired count
		'rss.channel.podcast:locked',
		'rss.channel.podcast:funding',
		'rss.channel.podcast:guid',
		'rss.channel.podcast:transcript',
		'rss.channel.podcast:chapters',
		'rss.channel.podcast:soundbite',
		'rss.channel.podcast:person',
		'rss.channel.podcast:location',
		'rss.channel.podcast:season',
		'rss.channel.podcast:episode',
		'rss.channel.item.podcast:transcript',
		'rss.channel.item.podcast:chapters',
		'rss.channel.item.podcast:soundbite',
		'rss.channel.item.podcast:person',
		'rss.channel.item.podcast:location',
		'rss.channel.item.podcast:season',
		'rss.channel.item.podcast:episode',
		'rss.channel.dc:creator',
		'rss.channel.dc:rights',
		'rss.channel.dc:publisher',
		'rss.channel.dc:date',
		'rss.channel.item.dc:creator',
		'rss.channel.item.dc:rights',
		'rss.channel.item.dc:date',
		'rss.channel.item.dc:subject',
		'rss.channel.atom:link',
		'rss.channel.sy:updatePeriod',
		'rss.channel.sy:updateFrequency',
		'rss.channel.sy:updateBase',
		'rss.channel.media:thumbnail',
		'rss.channel.media:content',
		'rss.channel.media:description',
		'rss.channel.item.media:thumbnail',
		'rss.channel.item.media:content',
		'rss.channel.item.media:description',
		'rss.channel.item.media:keywords',
		'rss.channel.georss:point',
		'rss.channel.georss:featurename',
		'rss.channel.item.georss:point',
		'rss.channel.item.georss:featurename',
		'rss.channel.slash:comments',
		'rss.channel.item.slash:comments',
		'rss.channel.wfw:commentRss',
		'rss.channel.item.wfw:commentRss',
		'rss.channel.item.thr:in-reply-to',
		'rss.channel.dcterms:created',
		'rss.channel.dcterms:modified',
		'rss.channel.item.dcterms:created',
		'rss.channel.item.dcterms:modified',
	]

	return allStopNodes.slice(0, Math.min(count, allStopNodes.length))
}
