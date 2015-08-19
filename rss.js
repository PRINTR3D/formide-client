var Watcher = require('rss-watcher');
watcher = new Watcher("https://libraries.io/search.atom?order=desc&q=formideos&sort=created_at");

watcher.run(function(err, articles) {
	for (var i in articles) {
		console.log(articles[i].title);
	}
});

/*
{ title: 'formideos-interface',
    description: 'This is the default interface for FORMIDE. It exposes all functionality of the FORMIDE client.',
    summary: null,
    date: Fri Aug 14 2015 14:01:46 GMT+0200 (CEST),
    pubdate: Thu Aug 13 2015 09:39:46 GMT+0200 (CEST),
    pubDate: Thu Aug 13 2015 09:39:46 GMT+0200 (CEST),
    link: '/npm/formideos-interface',
    guid: 'tag:libraries.io,2005:Project/928778',
    author: 'Libraries.io',
    comments: null,
    origlink: null,
    image: {},
    source: {},
    categories: [],
    enclosures: [],
    'atom:@': {},
    'atom:id': { '@': {}, '#': 'tag:libraries.io,2005:Project/928778' },
    'atom:published': { '@': {}, '#': '2015-08-13T07:39:46Z' },
    'atom:updated': { '@': {}, '#': '2015-08-14T12:01:46Z' },
    'atom:link': { '@': [Object] },
    'atom:title': { '@': {}, '#': 'formideos-interface' },
    'atom:content': 
     { '@': [Object],
       '#': 'This is the default interface for FORMIDE. It exposes all functionality of the FORMIDE client.' },
    'atom:author': { '@': {}, name: [Object] },
    meta: 
     { '#ns': [Object],
       '@': [Object],
       '#xml': [Object],
       '#type': 'atom',
       '#version': '1.0',
       title: 'Search for formideos - Libraries',
       description: null,
       date: Thu Aug 13 2015 09:39:46 GMT+0200 (CEST),
       pubdate: Thu Aug 13 2015 09:39:46 GMT+0200 (CEST),
       pubDate: Thu Aug 13 2015 09:39:46 GMT+0200 (CEST),
       link: 'https://libraries.io',
       xmlurl: 'https://libraries.io/search.atom?order=desc&q=formideos&sort=created_at',
       xmlUrl: 'https://libraries.io/search.atom?order=desc&q=formideos&sort=created_at',
       author: null,
       language: 'en-US',
       favicon: null,
       copyright: null,
       generator: null,
       cloud: {},
       image: {},
       categories: [],
       'atom:@': [Object],
       'atom:id': [Object],
       'atom:link': [Object],
       'atom:title': [Object],
       'atom:updated': [Object] } } ]
*/
