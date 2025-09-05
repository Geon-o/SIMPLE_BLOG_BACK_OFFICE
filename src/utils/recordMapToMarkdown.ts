type BlockType =
  | 'page'
  | 'header'
  | 'sub_header'
  | 'sub_sub_header'
  | 'text'
  | 'bulleted_list'
  | 'numbered_list'
  | 'quote'
  | 'divider'
  | 'code'
  | 'image'
  | 'video'
  | 'callout';

type TextAnnotation =
  | ['b'] // bold
  | ['i'] // italic
  | ['s'] // strikethrough
  | ['c'] // code
  | ['a', string]; // link

type TextFragment = [string, TextAnnotation[]?];

interface Block {
  role: string;
  value: {
    id: string;
    type: BlockType;
    properties?: {
      title?: TextFragment[];
      source?: string[][];
      caption?: TextFragment[];
      language?: TextFragment[];
    };
    format?: {
      page_icon?: string;
    };
    content?: string[];
  };
}

interface RecordMap {
  block: { [id: string]: Block };
}

function fragmentsToMarkdown(textFragments: TextFragment[] | undefined): string {
  if (!textFragments) {
    return '';
  }

  return textFragments
    .map(([text, annotations]) => {
      if (!annotations || annotations.length === 0) {
        return text;
      }

      return annotations.reduce((acc, annotation) => {
        const [type, value] = annotation;
        switch (type) {
          case 'b':
            return `**${acc}**`;
          case 'i':
            return `*${acc}*`;
          case 's':
            return `~~${acc}~~`;
          case 'c':
            return `\`${acc}\``;
          case 'a':
            return `[${acc}](${value})`;
          default:
            return acc;
        }
      }, text);
    })
    .join('');
}

function blockToMarkdown(
  block: Block,
  recordMap: RecordMap,
  indentLevel = 0
): string {
  if (!block || !block.value) {
    return '';
  }

  const { value } = block;
  const { type, properties, content, format } = value;
  const indent = '  '.repeat(indentLevel);

  switch (type) {
    case 'page':
      const title = fragmentsToMarkdown(properties?.title);
      const icon = format?.page_icon ? `${format.page_icon} ` : '';
      let pageContent = `# ${icon}${title}\n\n`;
      if (content) {
        pageContent += content
          .map((id) => {
            const childBlock = recordMap.block[id];
            return blockToMarkdown(childBlock, recordMap, 0);
          })
          .join('');
      }
      return pageContent;

    case 'header':
      return `# ${fragmentsToMarkdown(properties?.title)}\n\n`;

    case 'sub_header':
      return `## ${fragmentsToMarkdown(properties?.title)}\n\n`;

    case 'sub_sub_header':
      return `### ${fragmentsToMarkdown(properties?.title)}\n\n`;

    case 'text':
      return `${fragmentsToMarkdown(properties?.title)}\n\n`;

    case 'bulleted_list':
      let bulletedList = `${indent}* ${fragmentsToMarkdown(properties?.title)}\n`;
      if (content) {
        bulletedList += content
          .map((id) => {
            const childBlock = recordMap.block[id];
            return blockToMarkdown(childBlock, recordMap, indentLevel + 1);
          })
          .join('');
      }
      return bulletedList;

    case 'numbered_list':
      let numberedList = `${indent}1. ${fragmentsToMarkdown(properties?.title)}\n`;
      if (content) {
        numberedList += content
          .map((id) => {
            const childBlock = recordMap.block[id];
            return blockToMarkdown(childBlock, recordMap, indentLevel + 1);
          })
          .join('');
      }
      return numberedList;

    case 'quote':
      return `> ${fragmentsToMarkdown(properties?.title)}\n\n`;

    case 'divider':
      return '---\n\n';

    case 'code':
      const code = fragmentsToMarkdown(properties?.title);
      const language = (properties?.language?.[0]?.[0] || '').toLowerCase();
      return '```' + language + '\n' + code + '\n' + '```' + '\n\n';

    case 'image':
      const source = properties?.source?.[0]?.[0];
      const caption = fragmentsToMarkdown(properties?.caption);
      if (source) {
        let imageMarkdown = `![${caption || 'image'}](${source})\n`;
        if (caption) {
          imageMarkdown += `*${caption}*\n`;
        }
        return imageMarkdown + '\n';
      }
      return '';

    case 'video':
      const videoSource = properties?.source?.[0]?.[0];
      if (videoSource) {
        return `[Watch Video](${videoSource})\n\n`;
      }
      return '';
      
    case 'callout':
        const calloutIcon = format?.page_icon || '💡';
        const calloutText = fragmentsToMarkdown(properties?.title);
        return `> ${calloutIcon} ${calloutText}\n\n`;

    default:
      return '';
  }
}

export function recordMapToMarkdown(recordMap: RecordMap): string {
  if (!recordMap || !recordMap.block) {
    return '';
  }

  const blocks = recordMap.block;
  const rootBlockId = Object.keys(blocks).find(
    (id) => blocks[id].value.type === 'page'
  );

  if (!rootBlockId) {
    console.error('Could not find a root page block in the recordMap.');
    return '';
  }

  const rootBlock = blocks[rootBlockId];
  return blockToMarkdown(rootBlock, recordMap, 0);
}
