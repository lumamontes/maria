import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';

export const RichTextRenderer: React.FC<{ content: any, size: number }> = ({ content, size }) => {
  if (!content || !content.nodeType) return null;
  return documentToReactComponents(content, {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => (
        <img
          src={`https:${node.data.target.fields.file.url}`}
          height={size ?? node.data.target.fields.file.details.image.height}
          width={size ?? node.data.target.fields.file.details.image.width}
          alt={node.data.target.fields.title || ''}
          className="rounded-xl mx-auto my-8"
        />
      ),
    },
  });
}
