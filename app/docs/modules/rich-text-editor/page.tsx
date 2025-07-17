import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScriptCopyBtn } from '@/components/magicui/script-copy-btn';
import Link from 'next/link';
import { FileText, ExternalLink, Play, Edit } from 'lucide-react';

export default function RichTextEditorDocsPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Rich Text Editor</h1>
            <p className="text-muted-foreground">Feature-rich WYSIWYG editor with formatting and export capabilities</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="secondary">Editor</Badge>
          <Badge variant="outline">Intermediate</Badge>
          <Badge variant="outline">TypeScript</Badge>
        </div>

        <div className="flex gap-3">
          <Button asChild>
            <Link href="/preview/rich-text-editor">
              <Play className="h-4 w-4 mr-2" />
              Live Preview
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://github.com/JashAgrawal/supreme-toolkit" target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Source
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="installation">Installation</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What is Rich Text Editor?</CardTitle>
              <CardDescription>
                A powerful WYSIWYG text editor with comprehensive formatting options, toolbar customization, 
                image insertion, link management, and export capabilities for modern web applications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">✨ Key Features</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Rich text formatting (bold, italic, etc.)</li>
                    <li>• Headings and text styles</li>
                    <li>• Lists and blockquotes</li>
                    <li>• Link and image insertion</li>
                    <li>• Code blocks and inline code</li>
                    <li>• Undo/redo functionality</li>
                    <li>• Word and character counting</li>
                    <li>• Export to multiple formats</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">🛠️ Built With</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• ContentEditable API</li>
                    <li>• React hooks for state</li>
                    <li>• shadcn/ui components</li>
                    <li>• TypeScript for safety</li>
                    <li>• Custom toolbar system</li>
                    <li>• Export utilities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                WYSIWYG Editing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                What You See Is What You Get editing experience with:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <code className="text-sm">
                  • Real-time formatting preview<br/>
                  • Keyboard shortcuts support<br/>
                  • Customizable toolbar<br/>
                  • Auto-save capabilities
                </code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="installation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Installation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Install the module</h4>
                <ScriptCopyBtn script="npx supreme-toolkit@latest add rich-text-editor" />
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Configure the editor</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`// config.tsx
export const moduleConfigs = {
  richTextEditor: {
    placeholder: 'Start writing...',
    enableWordCount: true,
    enableSpellCheck: true,
    enableAutoSave: true,
    autoSaveInterval: 30000, // 30 seconds
    maxLength: 10000,
    linkValidation: true,
  }
};`}</code></pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Simple Rich Text Editor</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`import { RichTextEditor } from '@/components/rich-text-editor/ui/rich-text-editor';

export default function EditorPage() {
  const [content, setContent] = useState('');

  return (
    <RichTextEditor
      value={content}
      onChange={(html, json) => setContent(html)}
      placeholder="Start writing your content..."
      showWordCount={true}
      showCharacterCount={true}
    />
  );
}`}</code></pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">With Custom Toolbar</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`<RichTextEditor
  value={content}
  onChange={handleChange}
  toolbarConfig={{
    showBold: true,
    showItalic: true,
    showHeadings: true,
    showLink: true,
    showImage: true,
    showCodeBlock: true,
    showUndo: true,
    showRedo: true,
  }}
  maxLength={5000}
  enableAutoSave={true}
  onSave={handleSave}
/>`}</code></pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Prop</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Default</th>
                      <th className="text-left p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b">
                      <td className="p-2 font-mono">value</td>
                      <td className="p-2">string</td>
                      <td className="p-2">''</td>
                      <td className="p-2">Editor content (HTML)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">onChange</td>
                      <td className="p-2">function</td>
                      <td className="p-2">-</td>
                      <td className="p-2">Content change handler</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">placeholder</td>
                      <td className="p-2">string</td>
                      <td className="p-2">'Start writing...'</td>
                      <td className="p-2">Placeholder text</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">maxLength</td>
                      <td className="p-2">number</td>
                      <td className="p-2">undefined</td>
                      <td className="p-2">Maximum character limit</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Blog Post Editor</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`<RichTextEditor
  value={post.content}
  onChange={handleContentChange}
  toolbarConfig={{
    showHeadings: true,
    showBold: true,
    showItalic: true,
    showLink: true,
    showImage: true,
    showBlockquote: true,
    showCodeBlock: true,
  }}
  enableAutoSave={true}
  autoSaveInterval={30000}
  onSave={savePost}
/>`}</code></pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Comment Editor</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`<RichTextEditor
  value={comment}
  onChange={setComment}
  placeholder="Write your comment..."
  toolbarConfig={{
    showBold: true,
    showItalic: true,
    showLink: true,
    showCode: true,
  }}
  maxLength={1000}
  showCharacterCount={true}
/>`}</code></pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
