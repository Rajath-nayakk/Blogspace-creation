const users = [
  {
    name: 'Elena Rostova',
    username: 'elena_rostova',
    email: 'elena@blogspace.io',
    password: 'Password123!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: 'Senior Staff Engineer & Architect. Writing about distributed systems, resilient cloud infrastructure, and modern software craft.',
  },
  {
    name: 'Marcus Vance',
    username: 'marcusvance',
    email: 'marcus@blogspace.io',
    password: 'Password123!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bio: 'AI researcher and author. Exploring neural architectures, large language models, and practical AI tooling for developers.',
  },
  {
    name: 'Sophia Chen',
    username: 'sophiachen',
    email: 'sophia@blogspace.io',
    password: 'Password123!',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    bio: 'Founder & Angel Investor. Sharing unfiltered lessons on building seed-to-scale startups, unit economics, and team culture.',
  },
  {
    name: 'Devon Miller',
    username: 'devonmiller',
    email: 'devon@blogspace.io',
    password: 'Password123!',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    bio: 'Cybersecurity specialist and ethical hacker. Focused on zero-trust architectures, supply-chain safety, and cloud defense.',
  },
];

const blogs = [
  {
    title: 'The Architecture of Modern Web Applications: Lessons from 10 Years in Production',
    category: 'Web Development',
    tags: ['Architecture', 'React', 'Nodejs', 'Scalability'],
    description:
      'A deep dive into building modular, observable, and resilient web applications that survive high traffic, team expansion, and tech churn.',
    coverImage:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    authorIndex: 0,
    status: 'published',
    views: 1420,
    content: `Building web applications that gracefully scale beyond their initial proof-of-concept is one of the hardest engineering challenges in our industry. Over the past decade, frontend and backend technologies have shifted dramatically—from monolithic server-rendered pages to microfrontends and serverless functions.

Yet the core engineering principles that keep software reliable have stayed remarkably consistent.

## 1. Decoupling State from Rendering

The earliest pitfall in frontend architecture is tightly coupling UI components with global state managers. Whenever a state change forces unnecessary component re-renders across an entire tree, interaction latency creeps in.

> "Premature optimization is the root of all evil, but premature tight coupling is the quiet killer of maintainability."

By structuring components into **dumb presenters** and **smart feature containers**, you ensure testability without brittle mocking setups.

\`\`\`javascript
// Clean separation pattern: Presentational Component
export const ArticleCard = ({ title, excerpt, author, onBookmark }) => (
  <article className="border border-gray-100 p-6 rounded-xl hover:shadow-lg transition">
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    <p className="mt-2 text-gray-600">{excerpt}</p>
    <div className="mt-4 flex items-center justify-between">
      <span className="text-sm text-gray-500">By {author.name}</span>
      <button onClick={onBookmark} className="text-blue-600 hover:underline">
        Bookmark
      </button>
    </div>
  </article>
);
\`\`\`

## 2. The Resilient Backend: Beyond Simple CRUD

When your traffic surges 100x during a launch, databases choke first. Introducing idempotent job queues and read-replicas early prevents catastrophic outage cascades:

- **Strict Schema Migrations:** Always treat schema changes as backward-compatible transitions.
- **Fail Gracefully with Circuit Breakers:** If an external downstream API goes down, serve cached stale data rather than crashing the request.
- **Structured JSON Logging:** Trace IDs across incoming requests allow instant correlation in distributed environments.

## 3. Observability Over Guesswork

If you can’t measure your Core Web Vitals and backend P99 response times in real-time, you are flying blind. Monitor:

1. **LCP (Largest Contentful Paint)** under 1.8 seconds.
2. **FID (First Input Delay)** under 50 milliseconds.
3. **Database query execution thresholds** alerting at >100ms.

Architecting for resilience is not about picking the trendiest framework; it’s about crafting systems that are a joy to maintain six years from today.`,
  },
  {
    title: 'The Next Frontier in Autonomous AI Agents and Reasoning Models',
    category: 'Artificial Intelligence',
    tags: ['AI', 'MachineLearning', 'LLMs', 'Future'],
    description:
      'How test-time compute, reinforcement learning from reasoning traces, and multi-agent coordination are reshaping the boundary of machine intelligence.',
    coverImage:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    authorIndex: 1,
    status: 'published',
    views: 2850,
    content: `The paradigm of Artificial Intelligence has fundamentally pivoted. For years, scaling pre-training datasets was the primary driver of performance. Today, we are witnessing the emergence of **system-2 reasoning** and autonomous agentic workflows.

## The Shift to Test-Time Compute

Rather than outputting tokens instantaneously, modern reasoning models spend computational budget exploring multiple hypotheses, verifying intermediate steps, and backtracking when a logical dead-end is encountered.

\`\`\`
Prompt -> [Explore Hypothesis A] -> Verification Failed
       -> [Explore Hypothesis B] -> Step 1 Verified -> Step 2 Verified -> Optimal Solution
\`\`\`

This matches how human mathematicians and engineers tackle non-trivial proofs: sketching ideas on scrap paper before writing down the final answer.

## Key Building Blocks of Autonomous Agents

1. **Self-Correction and Reflection:** Evaluating one's own code output against runtime unit tests.
2. **Context Compaction:** Maintaining working memory across multi-hour tasks without losing goal alignment.
3. **Tool Grounding:** Interacting with real terminal shells, APIs, and git trees instead of relying on hallucinated memory.

### Real-World Implications

As models move from basic conversational interfaces to autonomous peer programmers, developers who master **agent orchestration** will see their leverage increase by orders of magnitude. The future belongs not to prompt whisperers, but to software architects who build verifiable guardrails around generative engines.`,
  },
  {
    title: 'Mastering Full-Stack TypeScript & JavaScript: Patterns Every Senior Needs',
    category: 'Programming',
    tags: ['JavaScript', 'TypeScript', 'CleanCode', 'Patterns'],
    description:
      'Essential structural patterns, type safety guardrails, and runtime validation techniques for modern enterprise applications.',
    coverImage:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    authorIndex: 0,
    status: 'published',
    views: 1980,
    content: `JavaScript is the ubiquitous runtime of the web, powering everything from interactive browsers to microservices and IoT devices. But with great flexibility comes significant architectural responsibility.

## Pattern 1: Discriminated Unions for Bulletproof State

Instead of tracking independent booleans like \`isLoading\`, \`isError\`, and \`data\`, model state as mutually exclusive states:

\`\`\`typescript
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
\`\`\`

This simple pattern eliminates impossible states at compile time, preventing UI bugs where a spinner and an error message render simultaneously.

## Pattern 2: Runtime Validation at the Boundary

TypeScript types disappear at runtime. Any data arriving from an external API, database, or URL query param is inherently untrusted.

- Validate incoming JSON payloads immediately using schemas.
- Transform and sanitize strings before feeding them to query builders.
- Fail early with human-readable error messages.

## Conclusion

Senior engineering isn't about writing clever, cryptic code. It is about creating crystal-clear primitives that make whole classes of bugs mathematically impossible to write.`,
  },
  {
    title: 'Zero Trust in Practice: Protecting Microservices from Supply-Chain Attacks',
    category: 'Cybersecurity',
    tags: ['Security', 'DevSecOps', 'ZeroTrust', 'Cloud'],
    description:
      'Practical security hardening: mutual TLS, ephemeral credentials, and automated vulnerability scanning in continuous delivery pipelines.',
    coverImage:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
    authorIndex: 3,
    status: 'published',
    views: 1120,
    content: `The traditional security perimeter is dead. With employees working remotely and microservices deployed across hybrid multi-cloud topologies, assuming safety behind an intranet firewall is an invitation to disaster.

## The Core Tenet: Never Trust, Always Verify

Zero Trust is not a single product you buy off the shelf. It is a philosophy built on three foundational pillars:

1. **Verify Explicitly:** Always authenticate and authorize based on all available data points (identity, location, device health, and service role).
2. **Least Privilege Access:** Restrict user and service access with just-in-time and just-enough-access (JIT/JEA) policies.
3. **Assume Breach:** Minimize blast radius by segmenting networks, encrypting communications end-to-end, and continuously analyzing telemetry for anomalies.

> "A breach is not a question of 'if', but 'when'. When the wall is breached, how easily can an attacker pivot laterally?"

## Securing Your Third-Party Dependencies

Modern web apps import thousands of transitive npm dependencies. Lock your package registries, generate SBOMs (Software Bill of Materials), and enforce integrity checks on every pull request.`,
  },
  {
    title: 'The Seed-to-Scale Playbook: How We Reached $1M ARR in 14 Months',
    category: 'Startups',
    tags: ['Startups', 'ProductMarketFit', 'SaaS', 'Growth'],
    description:
      'Raw numbers, failed experiments, and the high-leverage distribution channels that actually unlocked sustainable SaaS growth.',
    coverImage:
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&auto=format&fit=crop&q=80',
    authorIndex: 2,
    status: 'published',
    views: 3410,
    content: `Most startup post-mortems blame "running out of money." But running out of cash is merely the final symptom. The real illness is building something nobody is desperate to pay for.

Here is the exact framework we used to go from zero customers to $1M ARR with a lean 4-person team.

## Phase 1: Doing Things That Don't Scale

Before writing a single line of automated onboarding code, we onboarded our first 50 customers over live Zoom calls:

- We watched where users hesitated or clicked the wrong button.
- We asked about their daily workflows and budget authority.
- We fixed bugs within 20 minutes of the call ending.

This obsessive intimacy generated initial viral word-of-mouth that paid advertising could never replicate.

## Phase 2: Pricing for Value, Not Cost-Plus

Stop pricing your software at $9/month if it saves an engineering team 15 hours a week. Value-based pricing aligns your revenue with customer ROI:

- **Anchor high:** Target enterprise packages early.
- **Ditch free tiers early:** Charge from day one to filter for serious feedback.
- **Annual prepayment discounts:** Fund your runway with customer cash rather than dilution.

Build something undeniably useful, talk to your users every single morning, and treat churn as a direct signal to iterate.`,
  },
  {
    title: 'Deep Work in a Hyper-Connected World: Reclaiming Focus and Cognitive Flow',
    category: 'Productivity',
    tags: ['Productivity', 'Focus', 'Mindset', 'Work'],
    description:
      'A tactical guide to eliminating context switching, designing distraction-free workspaces, and producing high-value creative output.',
    coverImage:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
    authorIndex: 2,
    status: 'published',
    views: 2240,
    content: `In an era of relentless Slack notifications, micro-meetings, and infinite-scroll feeds, the ability to concentrate deeply for four uninterrupted hours is becoming a rare superpower.

## The Cost of Context Switching

Every time you pause writing code or drafting an essay to "quickly check an email," your brain leaves behind **attention residue**. Research shows it takes an average of 23 minutes to fully regain deep cognitive flow after a distraction.

### The 4-Hour Time-Blocking Protocol

1. **The Morning Vault (8:00 AM – 11:30 AM):** Phone on Airplane mode in another room. Zero communication apps open. Reserve this window strictly for your #1 highest-cognitive-demand task.
2. **Batch Communication (1:30 PM – 2:30 PM):** Clear email inbox, answer team chats, and review pull requests all in a single consolidated block.
3. **Shutdown Ritual (5:30 PM):** Write tomorrow's top three priorities on an index card. Close your laptop lid and mentally sign off.

Protect your attention like your most precious financial asset—because in the knowledge economy, it truly is.`,
  },
  {
    title: 'Designing for the Mind: The Subtle Psychology of Editorial Typography',
    category: 'Lifestyle',
    tags: ['Design', 'Typography', 'UIUX', 'Reading'],
    description:
      'Why line height, measure length, font pairing, and negative space dictate how deeply readers absorb complex written narratives.',
    coverImage:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80',
    authorIndex: 0,
    status: 'published',
    views: 1670,
    content: `Typography is the invisible voice of the written word. When typography is executed with precision, the reader never thinks about the font; they become completely immersed in the narrative.

## The Golden Rules of Editorial Reading

- **The Measure (Line Length):** The optimal line length for reading comfort is between 45 and 75 characters (including spaces). Lines longer than this cause eye fatigue when jumping to the next row; lines shorter than this break the rhythmic cadence of sentences.
- **Vertical Rhythm & Leading:** Body copy requires generous line spacing—typically between 1.6x and 1.85x the font size. Give the words room to breathe.
- **Harmonious Contrast:** Pair an authoritative, warm serif for body prose with a crisp, geometric sans-serif for navigational metadata and subheadings.

Great design is not about how much visual flair you can add, but how many distractions you can remove so that ideas can shine.`,
  },
  {
    title: 'The Evolution of Cloud Infrastructure: From Bare Metal to Edge Functions',
    category: 'Technology',
    tags: ['Cloud', 'DevOps', 'Serverless', 'Infrastructure'],
    description:
      'Understanding how compute placement has shifted over two decades, and where modern latency-critical applications should live today.',
    coverImage:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    authorIndex: 3,
    status: 'published',
    views: 1840,
    content: `Twenty years ago, deploying a new feature meant racking a physical Dell PowerEdge server in a datacenter, setting up cooling fans, and praying power cables stayed connected. Today, code executes within 15 milliseconds of the user anywhere across 300 worldwide edge locations.

## The Spectrum of Compute

1. **Virtual Machines & Bare Metal:** Maximum raw performance and kernel-level control, but high operational management overhead.
2. **Container Orchestration (Kubernetes):** Declarative scalability across fleets, perfect for long-running stateful services.
3. **Edge Micro-Workers (V8 Isolates):** Sub-millisecond cold starts with distributed state replication at the CDN boundary.

Choosing the right layer is always a matter of balancing cold-start trade-offs, state persistence requirements, and organizational bandwidth.`,
  },
];

const sampleComments = [
  'Outstanding breakdown! Decoupling state from presentation has saved our frontend team dozens of hours during refactors.',
  'The perspective on test-time compute is spot-on. We are already seeing reasoning models outperform raw parameter scaling on our benchmarks.',
  'This is one of the most comprehensive guides on modern software architecture I have read in months. Bookmarked!',
  'Love the clean typography and thoughtful reading experience on BLOGSPACE. Fantastic platform!',
  'The 4-hour focus block recommendation changed how I structure my entire work week.',
];

module.exports = { users, blogs, sampleComments };

