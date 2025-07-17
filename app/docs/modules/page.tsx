import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, 
  Bot, 
  Ticket, 
  MessageCircle, 
  Upload, 
  FileText,
  ArrowRight,
  Star,
  Download
} from 'lucide-react';

const modules = [
  {
    id: 'chat-realtime',
    name: 'Real-time Chat',
    description: 'Complete real-time chat system with Convex backend, message handling, presence indicators, and room management',
    icon: MessageSquare,
    category: 'Communication',
    difficulty: 'Intermediate',
    features: ['Real-time messaging', 'Presence indicators', 'Room management', 'Message history'],
    dependencies: ['convex', 'date-fns'],
  },
  {
    id: 'chatbot-gpt',
    name: 'AI Chatbot',
    description: 'AI chatbot widget with OpenAI integration, streaming responses, conversation management, and customizable interface',
    icon: Bot,
    category: 'AI',
    difficulty: 'Advanced',
    features: ['OpenAI integration', 'Streaming responses', 'Conversation history', 'Customizable UI'],
    dependencies: ['date-fns'],
  },
  {
    id: 'support-ticket-system',
    name: 'Support Tickets',
    description: 'Complete support ticket system with ticket creation, status management, comments, categories, and admin dashboard',
    icon: Ticket,
    category: 'Support',
    difficulty: 'Advanced',
    features: ['Ticket management', 'Comment system', 'Status tracking', 'Admin dashboard'],
    dependencies: ['date-fns'],
  },
  {
    id: 'feedback-widget',
    name: 'Feedback Widget',
    description: 'User feedback collection widget with ratings, screenshots, categories, and admin dashboard for managing feedback',
    icon: MessageCircle,
    category: 'Feedback',
    difficulty: 'Beginner',
    features: ['Rating system', 'Screenshot capture', 'Categories', 'Admin dashboard'],
    dependencies: [],
  },
  {
    id: 'image-uploader',
    name: 'Image Uploader',
    description: 'Complete image upload system with drag & drop, progress tracking, cloud storage integration, and image management',
    icon: Upload,
    category: 'Media',
    difficulty: 'Intermediate',
    features: ['Drag & drop', 'Cloud storage', 'Progress tracking', 'Image optimization'],
    dependencies: [],
  },
  {
    id: 'rich-text-editor',
    name: 'Rich Text Editor',
    description: 'Feature-rich WYSIWYG text editor with toolbar, formatting options, image upload, link insertion, and export capabilities',
    icon: FileText,
    category: 'Editor',
    difficulty: 'Intermediate',
    features: ['WYSIWYG editing', 'Rich formatting', 'Export options', 'Auto-save'],
    dependencies: [],
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Intermediate':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Advanced':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function ModulesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Supreme Toolkit Modules</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Complete collection of production-ready components for modern web applications
        </p>
        
        <div className="flex items-center gap-4 mb-6">
          <Badge variant="secondary" className="text-sm">
            6 Modules Available
          </Badge>
          <Badge variant="outline" className="text-sm">
            TypeScript Ready
          </Badge>
          <Badge variant="outline" className="text-sm">
            shadcn/ui Compatible
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {module.category}
                    </Badge>
                  </div>
                  <Badge className={cn("text-xs", getDifficultyColor(module.difficulty))}>
                    {module.difficulty}
                  </Badge>
                </div>
                
                <CardTitle className="text-lg">{module.name}</CardTitle>
                <CardDescription className="text-sm">
                  {module.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Features */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Key Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {module.features.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {module.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{module.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Dependencies */}
                  {module.dependencies.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Dependencies</h4>
                      <div className="flex flex-wrap gap-1">
                        {module.dependencies.slice(0, 2).map((dep) => (
                          <Badge key={dep} variant="outline" className="text-xs">
                            {dep}
                          </Badge>
                        ))}
                        {module.dependencies.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{module.dependencies.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/docs/modules/${module.id}`}>
                        View Docs
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/preview/${module.id}`}>
                        <Star className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Installation Guide */}
      <div className="mt-12 p-6 bg-muted/50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Quick Installation</h2>
        <p className="text-muted-foreground mb-4">
          Install any module with a single command using the Supreme Toolkit CLI:
        </p>
        <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm">
          npx supreme-toolkit@latest add [module-name]
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Example: <code className="bg-muted px-1 py-0.5 rounded">npx supreme-toolkit@latest add chat-realtime</code>
        </p>
      </div>
    </div>
  );
}
