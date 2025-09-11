import { AutoLinkPreview } from './AutoLinkPreview';

// Demo component showing realistic journalism link previews
export function DemoLinkPreviews() {
  const demoArticles = [
    {
      url: 'https://www.nytimes.com/2024/01/15/technology/ai-journalism-future.html',
      title: 'How AI is Transforming Modern Journalism',
      description: 'An in-depth look at artificial intelligence tools reshaping newsrooms and the future of reporting.',
      image: 'https://static01.nyt.com/images/2024/01/15/multimedia/15ai-journalism/15ai-journalism-articleLarge.jpg'
    },
    {
      url: 'https://www.theguardian.com/media/2024/02/08/digital-media-landscape-changes',
      title: 'The Evolving Digital Media Landscape: A Reporter\'s Perspective',
      description: 'Exploring how digital platforms are changing the way journalists tell stories and connect with audiences.',
      image: 'https://i.guim.co.uk/img/media/example-image.jpg'
    },
    {
      url: 'https://medium.com/@journalist/climate-reporting-challenges-2024',
      title: 'Climate Reporting in 2024: New Challenges and Opportunities',
      description: 'Personal insights from covering environmental stories in an era of climate change and misinformation.',
      image: ''
    },
    {
      url: 'https://www.washingtonpost.com/politics/2024/03/12/election-coverage-ethics/',
      title: 'Ethical Considerations in Election Coverage',
      description: 'Best practices for maintaining journalistic integrity during political campaigns.',
      image: 'https://www.washingtonpost.com/wp-apps/imrs.php?src=example.jpg'
    },
    {
      url: 'https://www.linkedin.com/pulse/data-journalism-tools-2024-maria-journalist/',
      title: 'Essential Data Journalism Tools for 2024',
      description: 'A comprehensive guide to the software and platforms every data journalist should know.',
      image: ''
    },
    {
      url: 'https://podcasts.spotify.com/show/journalism-today/episode-45',
      title: 'Journalism Today Podcast - Episode 45: Investigative Reporting',
      description: 'Deep dive into modern investigative journalism techniques and ethics.',
      image: ''
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Live URL Preview Demo</h2>
        <p className="text-gray-600">
          These previews automatically extract real metadata from URLs, just like social media platforms.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoArticles.map((article, index) => (
          <AutoLinkPreview
            key={index}
            url={article.url}
            fallbackTitle={article.title}
            fallbackDescription={article.description}
            fallbackImage={article.image}
            className="h-full"
          />
        ))}
      </div>
      
      {/* Features callout */}
      <div className="bg-blue-50 rounded-2xl p-8 mt-12">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          🚀 Automatic URL Preview Features
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Smart Detection</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Recognizes 50+ major news outlets</li>
              <li>• Extracts OpenGraph metadata</li>
              <li>• Identifies content types (articles, videos, podcasts)</li>
              <li>• Shows publication badges</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Professional Display</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Clean, journalism-focused design</li>
              <li>• Responsive layout</li>
              <li>• Loading states and error handling</li>
              <li>• Accessibility compliant</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}