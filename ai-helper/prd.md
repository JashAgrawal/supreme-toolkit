
---

# 📄 Product Requirements Document (PRD)

## 🧠 Product Name (WIP)

**Supreme Toolkit** (placeholder — name to be finalized)

## 🏗 Overview

Supreme Toolkit is a full-stack component registry that works seamlessly with `shadcn/ui` and `Next.js`. It allows developers to add complete, production-ready modules with one command:

```bash
npx shadcn@latest add "https://supreme.jashagrawal.in/r/module-name.json"
```

Each module includes not only UI components but also server actions, API routes, hooks, and configuration, enabling instant integration of powerful features into any modern full-stack app.

## 🧠 The Real Power: Predictable, Concept-Based Learning

The core value proposition of Supreme Toolkit lies in **predictability** and **concept-based learning** rather than tool-specific learning curves.

### 🎯 Learn Concepts Once, Use Everywhere
- Developers learn "payment gateway" concepts, not "Stripe-specific" or "Razorpay-specific" implementations
- When new providers are added (Razorpay, PayPal, etc.), the setup actions, hooks, and patterns remain identical
- Predictable file structure and API patterns across all modules, regardless of the underlying service

### 📈 Reduced Learning Curve
- Master payment concepts → works with any payment provider we support
- Master authentication patterns → works with any auth provider (Google, GitHub, email, etc.)
- Master email concepts → works with any email service (Resend, Nodemailer, etc.)

### 🔄 Framework-Agnostic Predictability
- Consistent patterns mean developers know exactly where functionality lives
- Same hooks, same actions, same configuration patterns across all modules
- Focus on building features, not learning tool-specific APIs

### 💡 Example: Payment Gateway Evolution
```typescript
// Today with Stripe
const { processPayment } = usePaymentGateway();
await processPayment({ amount: 1000, currency: 'usd' });

// Tomorrow with Razorpay (same API)
const { processPayment } = usePaymentGateway();
await processPayment({ amount: 1000, currency: 'usd' });

// Configuration changes, but developer experience remains identical
```

This approach ensures that developers invest in learning **concepts** that remain valuable as the toolkit evolves, rather than learning tool-specific APIs that become obsolete when switching providers.

---

## 🎯 Goals

* Enable developers to **install full-stack modules** (UI + API + logic) in seconds.
* Provide a **unified config system** to handle environment variables and setup options.
* Build a library of **plug-and-play modules** for common SaaS/app features.
* Maintain compatibility with `shadcn/ui` registry system.

---

## 🧱 Key Features

### ✅ 1. Registry-Compatible Modules

Each module uses a JSON registry schema like:

```bash
https://supreme.jashagrawal.in/r/stripe-subscription-gateway
```

Installs:

* `components/ui/PayButton.tsx`
* `hooks/useGateway.ts`
* `app/api/stripe/webhook/route.ts`
* `actions/onPaymentComplete.ts`

### ✅ 2. Full-Stack Support

Each module can include:

* UI components
* React hooks
* Server actions
* API routes
* Utility libraries
* Types
* `.env` variables (documented)

### ✅ 3. Central Config File

Each project includes a `config.tsx` file:

```ts
export const toolkitConfig = {
  stripe: { apiKey: process.env.STRIPE_KEY },
  resend: { apiKey: process.env.RESEND_KEY },
  ...
};
```

This replaces scattered constants with a typed, central config.

### ✅ 4. Multiple Mailer Backends

Two interchangeable modules:

* `mailer-nodemailer`
* `mailer-resend`

Both expose a consistent API:

```ts
sendEmail({ to, subject, html });
```

### ✅ 5. Developer Hooks

Each module exposes developer-friendly hooks:

* `useGateway()`
* `useWaitlist()`
* `useChat()`
* `useAuth()`

### ✅ 6. Server Action Entry Points

Modules export customizable server logic:

```ts
export async function onPaymentComplete({ session }) {
  // custom user logic here
}
```

---

## 📦 Modules (Initial List)

| Module Name                   | Description                                                   |
| ----------------------------- | --------------------------------------------------------------|
| `auth`                        | Plug-in betterAuth + Google OAuth in one command              |
| `stripe-subscription-gateway` | Stripe checkout button, webhook handler, payment success logic|
| `chat-realtime`               | Realtime chat system (Supabase or Pusher-based)               |
| `chatbot-gpt`                 | UI + OpenAI + backend logic for a chatbot widget              |
| `support-ticket-system`       | End-to-end ticketing interface + API                          |
| `webhook-handler`             | Generic webhook endpoint + logger UI                          |
| `newsletter-subscription`     | Email capture + MailerLite/Postmark hooks                     |
| `feedback-widget`             | Feedback form with UI + webhook/email integration             |
| `image-uploader`              | Drag/drop + backend uploader using Cloudinary/S3              |
| `analytics-snippet`           | Drop-in analytics with server + client logging                |
| `waitlist-component`          | Signup form + DB/API + redirect support                       |
| `mailer-nodemailer`           | Email sending using SMTP                                      |
| `mailer-resend`               | Email sending using Resend API                                |
| `rte-tiptap`                  | Rich Text Editor like Notion using Tiptap                     |
| `webhook-logger`              | Log and inspect 3rd-party webhooks                            |

---

## 📁 Directory & Registry Structure

Example structure for a module:

```
/registry/supremetoolkit/waitlist-component.json
/registry/supremetoolkit/waitlist-component/ui/WaitlistForm.tsx
/registry/supremetoolkit/waitlist-component/hooks/useWaitlist.ts
/registry/supremetoolkit/waitlist-component/api/waitlist/route.ts
```

---

## 🧪 Developer Experience

### Installation

```bash
npx shadcn@latest add "https://supreme.jashagrawal.in/r/waitlist-component.json"
```

Creates:

* `components/ui/WaitlistForm.tsx`
* `hooks/useWaitlist.ts`
* `api/waitlist/route.ts`
* Adds config hint to `config.tsx`

### Usage

```tsx
<WaitlistForm />
```

---

## 🔧 Config System

```ts
// config.tsx
export const toolkitConfig = {
  stripe: {
    apiKey: process.env.NEXT_PUBLIC_STRIPE_KEY,
    productIds: ["prod_123", "prod_456"],
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY,
  },
  auth: {
    providers:["google","email/pass","github"]
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4",
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  waitlist: {
    successRedirect: "/thanks",
  },
  richTextEditor: {
    saveEndpoint: "/api/save-content",
  },
  analytics: {
    trackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  },
};
```

Modules pull from this config using:

```ts
import { toolkitConfig } from "@/config";
```

---

## 📈 Roadmap

| Milestone             | Details                                   |
| --------------------- | ----------------------------------------- |
| ✅ MVP                 | Stripe + Waitlist + Mailer-Resend modules |
| 🔜 Registry Hosting   | Host JSON files on `supremetoolkit.in/r`  |
| 🔜 Dev CLI            | Optional: `npx supreme add module-name`   |
| 🔜 Community Modules  | Accept 3rd-party module submissions       |
| 🔜 Versioning Support | e.g., `/r/chatbot-gpt@v2`                 |

---

## 🔐 Security & Assumptions

* Modules must not override critical files
* Clear naming to avoid conflicts
* All backend logic should be opt-in or clearly scoped

---

## 🛠 Technical Implementation Details

### Module Structure
Each module follows a consistent structure:
```
/registry/supremetoolkit/module-name/
├── module-name.json          # Registry metadata
├── components/
│   └── ui/ComponentName.tsx  # UI components
├── hooks/
│   └── useModuleName.ts      # Custom hooks
├── actions/
│   └── serverActions.ts      # Server actions
├── api/
│   └── route.ts             # API routes
├── lib/
│   └── utils.ts             # Utility functions
├── types/
│   └── index.ts             # TypeScript definitions
└── README.md                # Module documentation
```

### Registry JSON Schema
```json
{
  "name": "stripe-subscription-gateway",
  "type": "registry:ui",
  "dependencies": ["stripe", "@stripe/stripe-js"],
  "devDependencies": [],
  "registryDependencies": [],
  "files": [
    {
      "name": "pay-button.tsx",
      "content": "...",
      "type": "registry:ui",
      "target": "components/ui/pay-button.tsx"
    },
    {
      "name": "use-gateway.ts",
      "content": "...",
      "type": "registry:hook",
      "target": "hooks/use-gateway.ts"
    },
    {
      "name": "stripe-webhook.ts",
      "content": "...",
      "type": "registry:api",
      "target": "app/api/stripe/webhook/route.ts"
    }
  ],
  "tailwind": {
    "config": {
      "theme": {
        "extend": {}
      }
    }
  },
  "cssVars": {},
  "meta": {
    "description": "Complete Stripe subscription gateway with UI and backend",
    "tags": ["payment", "stripe", "subscription"],
    "version": "1.0.0"
  }
}
```

### Environment Variables Management
Each module installation will:
1. Check for required environment variables
2. Generate `.env.example` entries
3. Provide setup instructions
4. Validate config on first run

## 💬 Future Ideas

* Web dashboard to browse + install modules
* Plugin marketplace or module store
* GitHub integration for registry auto-updates
* Module dependency resolution and conflict detection
* Hot-swappable module variants (e.g., switch from Resend to Nodemailer)
* Module testing framework and CI/CD integration
* Community contribution system with review process
* Module analytics and usage tracking
* Auto-generated documentation from module code
