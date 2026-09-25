# FormBharlo Frontend API & Developer Specification

> **Version**: 2.0  
> **Last Updated**: 2026-09-25  
> **Base URL**: `https://formbharlo.in` (Production) / `http://localhost:3000` (Local Development)

---

## 1. Product Vision & Minimalist UI Guidelines

FormBharlo is an automated, verified Indian government job notifications and exam updates portal. The goal for the new frontend is:

* **Distraction-Free & Ultra-Fast**: No heavy animations, no chaotic blinking badges, no bloated graphical elements.
* **Information Density & Scannability**: Candidates need to see Job Title, Organization, Vacancies, Qualification, Deadline, and Action Links in under 2 seconds.
* **Mobile-First & Data-Saver**: High performance on 4G/3G mobile devices across India.
* **Direct Action Hierarchy**: Every job must provide distinct, verified links for **Apply Online**, **Download PDF Notification**, and **Official Website**.

---

## 2. Page & Route Sitemap

| Route | Page Type | Purpose & Components |
| :--- | :--- | :--- |
| `/` | **Home / Feed** | Search bar, Category filter pills, high-density Job table/list, Pagination. |
| `/job/[id]` | **Job Detail** | Summary metadata, Action buttons (Apply/PDF/Portal), Photo Resizer utility banner, Clean Markdown content, Related jobs. |
| `/jobs/[category]/[state]` | **Category Hub** | Category-filtered job archives (e.g., `/jobs/Defence/all`, `/jobs/Banking/all`). |
| `/tools/image-resizer` | **Tool Utility** | 100% client-side photo & signature compressor/resizer (20–50 KB rules). |
| `/guides` | **Career Guides** | Editorial exam strategies, syllabus breakdowns, and document guidelines. |
| `/guides/[slug]` | **Single Guide** | Long-form markdown guide with table of contents. |
| `/about`, `/contact` | **Static Pages** | Organization details, editorial verification policy, contact email. |
| `/privacy`, `/terms` | **Compliance** | Legal policies, cookies, and AdSense compliance. |
| `/admin` & `/admin/login` | **Admin Console** | Internal dashboard for toggling job statuses and testing scraper webhooks. |

---

## 3. Backend REST APIs Reference

### 3.1 Get Jobs List (Filtered & Paginated)

* **Endpoint**: `GET /api/jobs`
* **Query Parameters**:
  * `search` *(string, optional)*: Search across title, organization, qualifications, and content.
  * `category` *(string, optional)*: Filter by category (`Government`, `Banking`, `Engineering`, `Healthcare`, `Defence`, `Teaching`, `State Exams`).
  * `page` *(number, optional, default: 1)*: Current page number.
  * `limit` *(number, optional, default: 20, max: 100)*: Items per page.
  * `raw` *(boolean, optional)*: If `true`, returns a flat raw array of all jobs (backward compatibility).

#### Request Example:
```http
GET /api/jobs?category=Defence&search=Army&page=1&limit=10
```

#### Response Payload (`200 OK`):
```json
{
  "jobs": [
    {
      "id": "5578",
      "status": "PUBLISHED",
      "category": "Defence",
      "organization": "Indian Army",
      "location": "All India",
      "type": "Govt / Regular",
      "vacancies": "350",
      "qualification": "10th / 12th Pass",
      "deadline": "2026-10-15",
      "date": "2026-09-24",
      "href": "/job/5578",
      "image_url": "https://...",
      "website_content": {
        "title": "Indian Army Agniveer Recruitment 2026 - Apply for 350 Posts",
        "summary": "Join the Indian Army as Agniveer General Duty and Technical trades. Read eligibility, physical standards, and online application steps.",
        "actual_link": "https://joinindianarmy.nic.in",
        "action": "Apply Online",
        "apply_link": "https://joinindianarmy.nic.in/registration",
        "notification_pdf": "https://joinindianarmy.nic.in/docs/notice_2026.pdf",
        "official_website": "https://joinindianarmy.nic.in"
      },
      "tags": ["Agniveer", "Army", "10th Pass"]
    }
  ],
  "pagination": {
    "total": 54,
    "page": 1,
    "limit": 10,
    "totalPages": 6,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "category_counts": {
    "Government": 22,
    "Defence": 14,
    "Banking": 8,
    "Engineering": 5,
    "Teaching": 3,
    "Healthcare": 2
  }
}
```

---

### 3.2 Get Single Job Details by ID

* **Endpoint**: `GET /api/jobs/[id]`
* **URL Parameter**: `id` *(string, required)* - The unique job ID.

#### Request Example:
```http
GET /api/jobs/5578
```

#### Response Payload (`200 OK`):
```json
{
  "job": {
    "id": "5578",
    "status": "PUBLISHED",
    "category": "Defence",
    "organization": "Indian Army",
    "location": "All India",
    "vacancies": "350",
    "qualification": "10th / 12th Pass",
    "date": "2026-09-24",
    "website_content": {
      "title": "Indian Army Agniveer Recruitment 2026",
      "summary": "Comprehensive overview of eligibility and selection process.",
      "markdown_content": "### Important Dates\n* Application Start: **20-09-2026**\n* Last Date: **15-10-2026**\n\n### Application Fee\n* Gen/OBC: ₹250\n* SC/ST: Nil\n\n### Eligibility Criteria\nCandidates must have passed Class 10 with minimum 45% aggregate marks.",
      "actual_link": "https://joinindianarmy.nic.in",
      "action": "Apply Online",
      "apply_link": "https://joinindianarmy.nic.in/apply",
      "notification_pdf": "https://joinindianarmy.nic.in/notice.pdf",
      "official_website": "https://joinindianarmy.nic.in"
    }
  },
  "related_jobs": [
    {
      "id": "5570",
      "category": "Defence",
      "organization": "Indian Navy",
      "website_content": {
        "title": "Indian Navy SSR & MR Recruitment 2026",
        "action": "Apply Online"
      }
    }
  ]
}
```

#### Error Responses:
* `404 Not Found`: `{"error": "Job not found"}`
* `400 Bad Request`: `{"error": "Job ID is required"}`

---

### 3.3 Admin Authentication & Job Management

| Method | Endpoint | Request Body | Notes |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/login` | `{"password": "..."}` | Sets HTTP-only `admin_session` JWT cookie for 24h. |
| `POST` | `/api/admin/logout` | `{}` | Clears session cookie. |
| `GET` | `/api/admin/jobs` | *None (Requires Cookie)* | Lists all jobs including UNPUBLISHED and draft states. |
| `POST` | `/api/admin/jobs` | `{"jobId": "5578", "status": "PUBLISHED"}` | Updates job publication status. |

---

### 3.4 SEO & AI Bot Endpoints

* **Sitemap**: `/sitemap.xml` (Auto-generated with dynamic job URLs & last-modified dates)
* **RSS Feed**: `/feed.xml` (Full RSS 2.0 XML feed for aggregators)
* **AI Bot Index**: `/llms.txt` and `/llms-full.txt` (Structured documentation for Gemini, ChatGPT, Claude, Grok)
* **AdSense Verification**: `/ads.txt` and `/api/ads.txt` (`google.com, pub-7508464610086212, DIRECT, f08c47fec0942fa0`)
* **Instant Search Indexing**: `POST /api/indexnow` (`{"urls": ["https://formbharlo.in/job/5578"]}`)

---

## 4. TypeScript Data Interfaces

```typescript
export type JobStatus = 'UNPUBLISHED' | 'GENERATED' | 'PUBLISHED';

export type JobCategory =
  | 'Government'
  | 'Banking'
  | 'Engineering'
  | 'Healthcare'
  | 'Defence'
  | 'Teaching'
  | 'State Exams'
  | 'General';

export interface WebsiteContent {
  title: string;
  markdown_content: string;
  actual_link: string;
  action: string;
  summary?: string;
  apply_link?: string;
  notification_pdf?: string;
  official_website?: string;
}

export interface Job {
  id: string;
  href: string;
  status: JobStatus;
  category?: JobCategory;
  organization?: string;
  location?: string;
  type?: string;
  salary?: string;
  qualification?: string;
  vacancies?: string;
  deadline?: string;
  date?: string;
  image_url?: string;
  featured?: boolean;
  tags?: string[];
  website_content: WebsiteContent;
}

export interface JobsResponse {
  jobs: Job[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  category_counts: Record<string, number>;
}
```

---

## 5. UI / UX Design Specifications for the New Frontend

### 5.1 Design Philosophy: "Sarkari Clarity, Zero Clutter"
1. **Clean Neutral Theme**: Crisp light mode (`bg-white`, `border-slate-200`, `text-slate-900`) and modern dark mode (`bg-slate-950`, `border-slate-800`, `text-slate-100`).
2. **Tabular & Compact Card Views**: 
   * Desktop: Clear 4-column data table (Notification Title & Org, Vacancies & Qualification, Last Date, Action Buttons).
   * Mobile: Clean vertical card with high-contrast text and 1-tap buttons.
3. **No Heavy Motion**: Use simple standard CSS transitions (`transition-colors duration-150`). Avoid spinning particles, floating backgrounds, or large unoptimized assets.

### 5.2 Direct Action Links UI Pattern
On every job detail page (`/job/[id]`), display three distinct action blocks in a clean grid:

```
+-----------------------------------------------------------------------+
|  [🚀 Apply Online Now]     [📄 Download Notification PDF]   [🌐 Official Portal] |
+-----------------------------------------------------------------------+
```

* **Apply Online**: Direct online registration form link (green/primary accent).
* **Download PDF**: Direct link to official notification PDF (blue/indigo accent).
* **Official Portal**: Official board/commission homepage link (neutral/slate accent).

### 5.3 Photo Resizer Funnel Banner
Place a lightweight helper card immediately above the application buttons:
> *"Uploading documents? Resize & compress your photo & signature to 20–50 KB with our free, private [Photo Resizer Tool](/tools/image-resizer)."*

### 5.4 Ad Banner Placement Rules
* **Never show empty gray boxes**: If AdSense approval is pending (`NEXT_PUBLIC_ENABLE_ADS !== 'true'`), ad components automatically render a clean Telegram/WhatsApp community channel link or stay completely invisible (`null`).
* Keep `<AdSenseScript />` mounted in root `layout.tsx` so Google crawlers verify domain ownership without displaying broken ad slots.

---

## 6. How to Test & Run Locally

```bash
# 1. Navigate to the web frontend
cd formbharlo-web

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Access local routes:
# Home:          http://localhost:3000
# Job API:       http://localhost:3000/api/jobs
# Job Detail:    http://localhost:3000/job/5578
# Photo Resizer: http://localhost:3000/tools/image-resizer
```
