# 🚀 Supreme Toolkit

A shadcn-like CLI tool for installing full-stack components with API routes, server actions, hooks, and configuration. Build complete SaaS features in seconds.

## 🎯 What is Supreme Toolkit?

Supreme Toolkit is a full-stack component registry that works seamlessly with `shadcn/ui` and `Next.js`. It allows developers to add complete, production-ready modules with one command:

```bash
npx shadcn@latest add "https://supreme.jashagrawal.in/r/module-name.json"
```

Each module includes not only UI components but also server actions, API routes, hooks, and configuration, enabling instant integration of powerful features into any modern full-stack app.

## ✨ Features

- 🔐 **Authentication** - betterAuth with Google, GitHub, Email providers
- 💳 **Payments** - Complete Stripe integration with webhooks
- 💬 **Chat** - Realtime chat with Supabase/Pusher
- 🤖 **Chatbot** - OpenAI-powered chatbot widget
- 🎫 **Support** - Complete ticketing system
- 📧 **Email** - Resend/Nodemailer integration
- 📝 **Rich Text** - Tiptap editor with collaboration
- 📊 **Analytics** - Custom event tracking
- 🖼️ **Uploads** - Cloudinary/S3 image uploads
- 📋 **Waitlist** - Email capture with management
- 💌 **Newsletter** - Subscription management
- 🔗 **Webhooks** - Generic webhook handlers
- 💭 **Feedback** - User feedback widgets

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/yourusername/supreme-toolkit.git
cd supreme-toolkit
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
# Fill in your API keys and configuration
```

### 3. Configure Modules

Edit `config.tsx` to enable the modules you want to use:

```typescript
export const toolkitConfig: ToolkitConfig = {
  auth: {
    providers: ['google', 'email', 'github'],
  },
  stripe: {
    apiKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    productIds: ['prod_example1', 'prod_example2'],
  },
  // ... other modules
};
```

### 4. Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## 📦 Available Modules

| Module | Description | Status |
|--------|-------------|--------|
| `auth` | betterAuth + OAuth providers | 🔄 In Development |
| `stripe-subscription-gateway` | Complete Stripe integration | 🔄 In Development |
| `chat-realtime` | Realtime chat system | 📋 Planned |
| `chatbot-gpt` | OpenAI chatbot widget | 📋 Planned |
| `support-ticket-system` | End-to-end ticketing | 📋 Planned |
| `image-uploader` | Cloudinary/S3 uploads | 📋 Planned |
| `rich-text-editor` | Tiptap editor | 📋 Planned |
| `analytics-snippet` | Custom analytics | 📋 Planned |
| `waitlist-component` | Email capture | 📋 Planned |
| `newsletter-subscription` | Email subscriptions | 📋 Planned |
| `feedback-widget` | User feedback | 📋 Planned |
| `webhook-handler` | Webhook management | 📋 Planned |

## 🏗️ Project Structure

```
supreme-toolkit/
├── app/                    # Next.js app directory
├── components/             # React components
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
├── actions/               # Server actions
├── lib/                   # Utility libraries
├── types/                 # TypeScript definitions
├── registry/              # Module registry
│   └── supremetoolkit/    # Supreme Toolkit modules
├── config.tsx             # Central configuration
└── .env.example          # Environment variables template
```

## 🔧 Configuration

Supreme Toolkit uses a centralized configuration system in `config.tsx`. This file contains all module configurations and environment variables.

### Example Configuration

```typescript
export const toolkitConfig: ToolkitConfig = {
  auth: {
    providers: ['google', 'email', 'github'],
  },
  stripe: {
    apiKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    productIds: ['prod_123', 'prod_456'],
    successUrl: '/payment/success',
    cancelUrl: '/payment/cancel',
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY!,
    fromEmail: 'noreply@yourapp.com',
  },
};
```

## 🎨 Server Actions Pattern

Each module includes event-driven server actions that you can customize:

```typescript
// Example: Auth module server actions
export async function onUserSignup(params: {
  user: User;
  provider: string;
}) {
  // Your custom logic here
  console.log(`New user signed up: ${params.user.email}`);

  // Send welcome email
  // Update analytics
  // Create user profile
}

export async function onUserLogin(params: {
  user: User;
  isFirstLogin: boolean;
}) {
  // Your custom login logic
}
```

## 🧪 Development

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## 📚 Documentation

- [Getting Started Guide](./docs/getting-started.md)
- [Module Development](./docs/module-development.md)
- [Configuration Reference](./docs/configuration.md)
- [API Reference](./docs/api-reference.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the component system inspiration
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- All the amazing open-source libraries we integrate with

---

**Built with ❤️ for the developer community**
