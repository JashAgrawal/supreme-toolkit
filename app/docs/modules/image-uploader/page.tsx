import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScriptCopyBtn } from '@/components/magicui/script-copy-btn';
import Link from 'next/link';
import { Upload, ExternalLink, Play, Cloud } from 'lucide-react';

export default function ImageUploaderDocsPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Image Uploader</h1>
            <p className="text-muted-foreground">Complete image upload system with cloud storage and optimization</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="secondary">Media</Badge>
          <Badge variant="outline">Intermediate</Badge>
          <Badge variant="outline">TypeScript</Badge>
        </div>

        <div className="flex gap-3">
          <Button asChild>
            <Link href="/preview/image-uploader">
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
              <CardTitle>What is Image Uploader?</CardTitle>
              <CardDescription>
                A complete image upload system with drag & drop functionality, progress tracking, 
                cloud storage integration, thumbnail generation, and image management capabilities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">✨ Key Features</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Drag & drop file upload</li>
                    <li>• Progress tracking</li>
                    <li>• Cloud storage (Cloudinary/S3)</li>
                    <li>• Image optimization</li>
                    <li>• Thumbnail generation</li>
                    <li>• File validation</li>
                    <li>• Paste upload support</li>
                    <li>• Image gallery</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">🛠️ Built With</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• HTML5 File API</li>
                    <li>• Canvas for image processing</li>
                    <li>• React hooks for state</li>
                    <li>• shadcn/ui components</li>
                    <li>• TypeScript for safety</li>
                    <li>• Server actions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Cloud Storage Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Supports multiple cloud storage providers:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <code className="text-sm">
                  • Cloudinary (recommended)<br/>
                  • Amazon S3<br/>
                  • Local file system<br/>
                  • Custom storage providers
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
                <ScriptCopyBtn script="npx supreme-toolkit@latest add image-uploader" />
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Configure cloud storage</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`// config.tsx
export const moduleConfigs = {
  imageUpload: {
    provider: 'cloudinary', // 'cloudinary' | 's3' | 'local'
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    maxFileSize: 10, // MB
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    enableThumbnails: true,
    enableOptimization: true,
  }
};`}</code></pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. Environment Variables</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret`}</code></pre>
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
                <h4 className="font-semibold mb-2">Simple Image Uploader</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`import { ImageUploader } from '@/components/image-uploader/ui/image-uploader';

export default function UploadPage() {
  const handleUploadComplete = (images) => {
    console.log('Uploaded images:', images);
  };

  return (
    <ImageUploader
      userId={user.id}
      maxFiles={5}
      maxFileSize={10}
      onUploadComplete={handleUploadComplete}
    />
  );
}`}</code></pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">With Custom Configuration</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`<ImageUploader
  userId={user.id}
  folder="profile-pictures"
  maxFiles={1}
  maxFileSize={5}
  allowedFormats={['jpg', 'jpeg', 'png']}
  enableThumbnails={true}
  enableDragDrop={true}
  enablePasteUpload={true}
  onUploadComplete={handleUploadComplete}
  onUploadError={handleUploadError}
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
                      <td className="p-2 font-mono">maxFiles</td>
                      <td className="p-2">number</td>
                      <td className="p-2">10</td>
                      <td className="p-2">Maximum number of files</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">maxFileSize</td>
                      <td className="p-2">number</td>
                      <td className="p-2">10</td>
                      <td className="p-2">Maximum file size in MB</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">allowedFormats</td>
                      <td className="p-2">string[]</td>
                      <td className="p-2">['jpg', 'png']</td>
                      <td className="p-2">Allowed file formats</td>
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
                <h4 className="font-semibold mb-2">Profile Picture Upload</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm"><code>{`<ImageUploader
  userId={user.id}
  folder="avatars"
  maxFiles={1}
  maxFileSize={2}
  allowedFormats={['jpg', 'jpeg', 'png']}
  enableThumbnails={true}
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
