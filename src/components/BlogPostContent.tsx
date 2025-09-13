import {RichTextRenderer} from './RichTextRenderer';
import { Calendar, ClockIcon, User } from 'lucide-react';

export default function BlogPostContent({ post } : { post: any }) {
  if (!post) {
    return (
      <div className="text-center mt-10 text-lg">
        <p>Post not found</p>
      </div>
    );
  }

  return (
    <section className="container mx-auto">
      {/* Banner Image */}
      {post.bannerUrl && (
        <div className="h-[60vh] mb-8">
          <img
            src={post.bannerUrl.startsWith('https') ? post.bannerUrl : `https:${post.bannerUrl}`}
            alt={post.title}
            className="w-full h-full object-cover rounded-2xl shadow-2xl"
          />
        </div>
      )}

      {/* Blog Content */}
      <article className="max-w-3xl mx-auto mt-12">
        <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
        <div className="flex flex-col sm:flex-row gap-6 text-gray-600 mb-8">
          <time className="place-items-center justify-items-center gap-2 text-sm flex items-center">
            <Calendar className="text-lg" />
            {post.date}
          </time>
          {post.author && (
            <p className="place-items-center justify-items-center gap-2 text-sm flex items-center">
              <User className="text-lg" />
              {post.author.fields.name}
            </p>
          )}
          {post.reading_time && (
            <p className="place-items-center justify-items-center gap-2 text-sm flex items-center">
              <ClockIcon className="text-lg" />
              {post.reading_time} min
            </p>
          )}
        </div>
        {/* Render Rich Text Content */}
          <div className="space-y-8 py-8 pb-16">
            <RichTextRenderer content={post.description} />
          </div>
      </article>
    </section>
  );
}
