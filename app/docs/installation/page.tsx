import { ScriptCopyBtn } from "@/components/magicui/script-copy-btn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function InstallationDocsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Installation
        </h1>
        <p className="text-xl text-muted-foreground">
          How to install dependencies and structure your app.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Requirements
        </h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Next.js 13+ with App Router
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            React 18+
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Tailwind CSS
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            TypeScript (recommended)
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Setup
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">1. Initialize shadcn/ui</h3>
            <p className="text-muted-foreground mb-3">
              Start by setting up shadcn/ui in your Next.js project.
            </p>
            <ScriptCopyBtn
              codeLanguage="bash"
              lightTheme="github-light"
              darkTheme="github-dark"
              commandMap={{
                npm: "npx shadcn@latest init",
                yarn: "yarn dlx shadcn@latest init",
                pnpm: "pnpm dlx shadcn@latest init"
              }}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">2. Install base components</h3>
            <p className="text-muted-foreground mb-3">
              Add the essential shadcn/ui components that Supreme Toolkit modules depend on.
            </p>
            <ScriptCopyBtn
              codeLanguage="bash"
              lightTheme="github-light"
              darkTheme="github-dark"
              commandMap={{
                npm: "npx shadcn@latest add button card input label",
                yarn: "yarn dlx shadcn@latest add button card input label",
                pnpm: "pnpm dlx shadcn@latest add button card input label"
              }}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">3. Install Supreme Toolkit config module</h3>
            <p className="text-muted-foreground mb-3">
              This sets up the configuration system that all Supreme Toolkit modules use for API keys and settings.
            </p>
            <ScriptCopyBtn
              codeLanguage="bash"
              lightTheme="github-light"
              darkTheme="github-dark"
              commandMap={{
                npm: "npx shadcn@latest add \"https://supreme.jashagrawal.in/r/config-module\"",
                yarn: "yarn dlx shadcn@latest add \"https://supreme.jashagrawal.in/r/config-module\"",
                pnpm: "pnpm dlx shadcn@latest add \"https://supreme.jashagrawal.in/r/config-module\""
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Install Components
        </h2>
        <p className="leading-7">
          Browse the available components and install the ones you need.
        </p>
        
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  🔐 Authentication
                </CardTitle>
                <Badge>Ready</Badge>
              </div>
              <CardDescription>
                Complete auth system with betterAuth, multiple providers, and guards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScriptCopyBtn
                codeLanguage="bash"
                lightTheme="github-light"
                darkTheme="github-dark"
                commandMap={{
                  npm: "npx shadcn@latest add \"https://supreme.jashagrawal.in/r/auth-module\"",
                  yarn: "yarn dlx shadcn@latest add \"https://supreme.jashagrawal.in/r/auth-module\"",
                  pnpm: "pnpm dlx shadcn@latest add \"https://supreme.jashagrawal.in/r/auth-module\""
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  🌙 Theme Toggle
                </CardTitle>
                <Badge>Ready</Badge>
              </div>
              <CardDescription>
                Complete dark mode solution with theme provider and toggle variants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScriptCopyBtn
                codeLanguage="bash"
                lightTheme="github-light"
                darkTheme="github-dark"
                commandMap={{
                  npm: "npx shadcn@latest add \"https://supreme.jashagrawal.in/r/theme-toggle\"",
                  yarn: "yarn dlx shadcn@latest add \"https://supreme.jashagrawal.in/r/theme-toggle\"",
                  pnpm: "pnpm dlx shadcn@latest add \"https://supreme.jashagrawal.in/r/theme-toggle\""
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  📝 Waitlist
                </CardTitle>
                <Badge>Ready</Badge>
              </div>
              <CardDescription>
                Complete waitlist system with validation and email confirmations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScriptCopyBtn
                codeLanguage="bash"
                lightTheme="github-light"
                darkTheme="github-dark"
                commandMap={{
                  npm: "npx shadcn@latest add \"https://supreme.jashagrawal.in/r/waitlist-module\"",
                  yarn: "yarn dlx shadcn@latest add \"https://supreme.jashagrawal.in/r/waitlist-module\"",
                  pnpm: "pnpm dlx shadcn@latest add \"https://supreme.jashagrawal.in/r/waitlist-module\""
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  📧 Mailer
                </CardTitle>
                <Badge>Ready</Badge>
              </div>
              <CardDescription>
                Universal email system with Resend and Nodemailer support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScriptCopyBtn
                codeLanguage="bash"
                lightTheme="github-light"
                darkTheme="github-dark"
                commandMap={{
                  npm: "npx shadcn@latest add \"https://supreme.jashagrawal.in/r/mailer-module\"",
                  yarn: "yarn dlx shadcn@latest add \"https://supreme.jashagrawal.in/r/mailer-module\"",
                  pnpm: "pnpm dlx shadcn@latest add \"https://supreme.jashagrawal.in/r/mailer-module\""
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Manual Installation
        </h2>
        <p className="leading-7">
          If you prefer to install components manually, you can copy and paste the code.
        </p>
        
        <div className="rounded-lg border bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            Each component page includes the source code that you can copy and paste into your project.
            This is useful if you want to customize the components or understand how they work.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          That's it
        </h2>
        <p className="leading-7">
          You can now start using Supreme Toolkit components in your project. Check out the{" "}
          <a href="/docs/components/theme-toggle" className="underline underline-offset-4">
            component documentation
          </a>{" "}
          to learn more about each component.
        </p>
      </div>
    </div>
  );
}
