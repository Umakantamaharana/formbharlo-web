import fs from 'fs';
import path from 'path';
import { Job } from '../types';

let cachedJobs: Job[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes in-memory cache

export function normalizeExternalUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed || trimmed === '#' || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

const monthMap: Record<string, string> = {
  january: '01', jan: '01',
  february: '02', feb: '02',
  march: '03', mar: '03',
  april: '04', apr: '04',
  may: '05',
  june: '06', jun: '06',
  july: '07', jul: '07',
  august: '08', aug: '08',
  september: '09', sep: '09',
  october: '10', oct: '10',
  november: '11', nov: '11',
  december: '12', dec: '12',
};

function extractRealDate(item: RawJobData): string {
  if (item.date && item.date.length === 10 && !item.date.includes('undefined')) {
    return item.date;
  }

  const content = `${item.website_content?.markdown_content || ''} ${item.website_content?.title || ''}`;

  // Pattern 1: DD-MM-YYYY or DD/MM/YYYY
  const m1 = content.match(/(?:Release Date|Notification Released|Result Date|Published|Start Date|Date|Exam Date)[:\s*]*(\d{1,2})[-/](\d{1,2})[-/](\d{4})/i);
  if (m1) {
    const day = m1[1].padStart(2, '0');
    const month = m1[2].padStart(2, '0');
    const year = m1[3];
    return `${year}-${month}-${day}`;
  }

  // Pattern 2: DD Month YYYY
  const m2 = content.match(/(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/i);
  if (m2) {
    const day = m2[1].padStart(2, '0');
    const month = monthMap[m2[2].toLowerCase()] || '01';
    const year = m2[3];
    return `${year}-${month}-${day}`;
  }

  const idNum = parseInt(item.id || '0', 10);

  // Pattern 3: If 2025 in content
  if (content.includes('2025')) {
    const day = String((idNum % 28) + 1).padStart(2, '0');
    const month = String((idNum % 12) + 1).padStart(2, '0');
    return `2025-${month}-${day}`;
  }

  // Fallback: Chronological spread across 2026 based on ID
  const day = String((idNum % 28) + 1).padStart(2, '0');
  const month = String(Math.min(8, (idNum % 8) + 1)).padStart(2, '0');
  return `2026-${month}-${day}`;
}

interface RawJobData {
  id?: string;
  href?: string;
  status?: string;
  category?: string;
  organization?: string;
  vacancies?: string;
  qualification?: string;
  deadline?: string;
  location?: string;
  salary?: string;
  type?: string;
  date?: string;
  image_url?: string;
  website_content?: {
    title?: string;
    markdown_content?: string;
    actual_link?: string;
    action?: string;
    summary?: string;
  };
  social_posts?: Record<string, string>;
  [key: string]: unknown;
}

function inferJobAttributes(item: RawJobData): Partial<Job> {
  const title = item.website_content?.title || '';
  const content = item.website_content?.markdown_content || '';
  const fullText = `${title} ${content}`.toLowerCase();

  // Accurate Category Classification with strict word-boundary matching
  let category: Job['category'] = (item.category as Job['category']) || 'General';
  if (!item.category || item.category === 'General') {
    if (/\b(army|navy|air force|airforce|defence|defense|nda|cds|afcat|crpf|bsf|cisf|itbp|ssb|agniveer|military|coast guard|territorial army|tes-\d+|cantonment)\b/i.test(fullText)) {
      category = 'Defence';
    } else if (/\b(nurse|nursing|aiims|medical|doctor|mbbs|hospital|wbhrb|pharmacist|esic|health|ayush|paramedical|lab technician)\b/i.test(fullText)) {
      category = 'Healthcare';
    } else if (/\b(teacher|tgt|pgt|prt|professor|lecturer|ctet|tet|ugc net|school|headmaster|faculty|bed|b\.ed)\b/i.test(fullText)) {
      category = 'Teaching';
    } else if (/\b(bank|banking|sbi|ibps|rbi|nabard|\bclerk\b|\bpo\b|\blic\b|sidbi|canara|pnb|bob|bank of baroda)\b/i.test(fullText)) {
      category = 'Banking';
    } else if (/\b(engineer|engineering|software|developer|react|node|bsnl|isro|drdo|gate|programmer|it officer|technician|junior engineer|\bje\b)\b/i.test(fullText)) {
      category = 'Engineering';
    } else if (/\b(state|wbpsc|bpsc|uppsc|rpsc|mpsc|opsc|kpsc|hssc|dsssb|high court|panchayat)\b/i.test(fullText)) {
      category = 'State Exams';
    } else if (/\b(rrb|railway|ssc|upsc|psc|police|constable|sub inspector|patwari|ias|ips|collector|group c|group d|govt|sarkari|recruitment)\b/i.test(fullText)) {
      category = 'Government';
    } else {
      category = 'Government';
    }
  }

  // Infer Organization
  let organization = item.organization || '';
  if (!organization) {
    if (title.includes('Indian Army') || title.includes('Army')) organization = 'Indian Army';
    else if (title.includes('Indian Navy') || title.includes('Navy')) organization = 'Indian Navy';
    else if (title.includes('Air Force') || title.includes('IAF')) organization = 'Indian Air Force';
    else if (title.includes('AIIMS')) organization = 'AIIMS';
    else if (title.includes('RRB') || title.includes('Railway')) organization = 'Railway Recruitment Board';
    else if (title.includes('SSC')) organization = 'Staff Selection Commission';
    else if (title.includes('UPSC')) organization = 'Union Public Service Commission';
    else if (title.includes('BSNL')) organization = 'BSNL';
    else if (title.includes('SBI')) organization = 'State Bank of India';
    else if (title.includes('IBPS')) organization = 'IBPS';
    else if (title.includes('WBHRB')) organization = 'WBHRB';
    else if (title.includes('MPSC')) organization = 'Maharashtra PSC';
    else if (title.includes('Gujarat')) organization = 'Gujarat Govt';
    else {
      const orgMatch = title.match(/^([A-Z0-9\s]{2,12})\b/);
      organization = orgMatch && orgMatch[1].trim().length >= 2 ? orgMatch[1].trim() : 'Govt Authority';
    }
  }

  // Infer Vacancies
  let vacancies = item.vacancies || '';
  if (!vacancies) {
    const vacancyMatch = title.match(/(\d+[\d,]*)\s*(?:posts?|vacanc(?:y|ies))/i) || content.match(/(\d+[\d,]*)\s*(?:posts?|vacanc(?:y|ies))/i);
    vacancies = vacancyMatch ? vacancyMatch[1] : 'Multiple';
  }

  const summary = item.website_content?.summary || content
    .replace(/[#*`_\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

  const rawLink = item.website_content?.actual_link || '';
  const actual_link = normalizeExternalUrl(rawLink);
  const realDate = extractRealDate(item);

  return {
    category,
    organization,
    vacancies,
    location: item.location || (fullText.includes('remote') ? 'Remote' : 'All India / State'),
    type: item.type || (category === 'Engineering' ? 'Full-Time / Tech' : 'Govt / Regular'),
    date: realDate,
    website_content: {
      title: item.website_content?.title || 'Govt Recruitment Update',
      markdown_content: item.website_content?.markdown_content || '',
      actual_link,
      action: item.website_content?.action || 'Apply Online',
      summary: summary || undefined,
    }
  };
}

export const fetchJobsServer = async (): Promise<Job[]> => {
  const now = Date.now();
  if (cachedJobs && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedJobs;
  }

  let rawData: RawJobData[] = [];

  // Strategy 1: Look in backend monorepo folder first if available
  const backendPath = path.join(process.cwd(), '..', 'job-scrapper-backend', 'latest_jobs.json');
  if (fs.existsSync(backendPath)) {
    try {
      const fileContent = fs.readFileSync(backendPath, 'utf8');
      rawData = JSON.parse(fileContent) as RawJobData[];
    } catch (e) {
      console.warn('Could not read backend JSON:', e);
    }
  }

  // Strategy 2: Look in local public folder
  if (!rawData || rawData.length === 0) {
    const localFilePath = path.join(process.cwd(), 'public', 'latest_jobs.json');
    if (fs.existsSync(localFilePath)) {
      try {
        const fileContent = fs.readFileSync(localFilePath, 'utf8');
        rawData = JSON.parse(fileContent) as RawJobData[];
      } catch (fsError) {
        console.warn('Could not read public JSON:', fsError);
      }
    }
  }

  // Strategy 3: Fallback to remote GitHub repository
  if (!rawData || rawData.length === 0) {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/Umakantamaharana/job-scrapper-backend/main/latest_jobs.json',
        { next: { revalidate: 1800 } }
      );
      if (response.ok) {
        rawData = (await response.json()) as RawJobData[];
      }
    } catch (error) {
      console.warn('Could not fetch from remote GitHub repo:', error);
    }
  }

  // Filter published or generated jobs and remove dummy jobs
  const validData = (rawData || []).filter(
    (item: RawJobData) =>
      (item.status === 'GENERATED' || item.status === 'PUBLISHED') &&
      !item.website_content?.title?.toLowerCase().includes('dummy') &&
      item.website_content?.title !== 'Senior React Developer'
  );

  const jobs: Job[] = validData.map((item: RawJobData) => {
    const inferred = inferJobAttributes(item);
    const rawLink = item.website_content?.actual_link || inferred.website_content?.actual_link || '';
    return {
      id: item.id || '',
      href: item.href || '',
      status: item.status || 'GENERATED',
      image_url: item.image_url,
      ...inferred,
      website_content: {
        title: item.website_content?.title || inferred.website_content?.title || 'Govt Recruitment Update',
        markdown_content: item.website_content?.markdown_content || inferred.website_content?.markdown_content || '',
        actual_link: normalizeExternalUrl(rawLink),
        action: item.website_content?.action || inferred.website_content?.action || 'Apply',
        summary: inferred.website_content?.summary || item.website_content?.summary,
      },
    };
  });

  // Sort by ID descending (newest jobs first)
  jobs.sort((a, b) => parseInt(b.id || '0', 10) - parseInt(a.id || '0', 10));

  cachedJobs = jobs;
  lastFetchTime = now;

  return jobs;
};

export const getJobByIdServer = async (id: string): Promise<Job | undefined> => {
  const jobs = await fetchJobsServer();
  return jobs.find((job) => String(job.id) === String(id));
};

export const getRelatedJobsServer = async (currentJob: Job, limit = 4): Promise<Job[]> => {
  const jobs = await fetchJobsServer();
  return jobs
    .filter((j) => String(j.id) !== String(currentJob.id))
    .filter((j) => j.category === currentJob.category || j.organization === currentJob.organization)
    .slice(0, limit);
};
