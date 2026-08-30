import fs from 'fs';
import path from 'path';
import { Job } from '../types';

let cachedJobs: Job[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes in-memory cache

export function normalizeExternalUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
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

  // Infer Category if not already present
  let category: Job['category'] = (item.category as Job['category']) || 'General';
  if (!item.category || item.category === 'General') {
    if (/nurse|aiims|medical|doctor|health|hospital|wbhrb|pharmacist|esic/i.test(fullText)) {
      category = 'Healthcare';
    } else if (/bank|sbi|ibps|rbi|nabard|clerk|po\b|lic/i.test(fullText)) {
      category = 'Banking';
    } else if (/engineer|software|developer|react|tech|bsnl|isro|drdo|gate|programmer|it officer/i.test(fullText)) {
      category = 'Engineering';
    } else if (/rrb|railway|ssc|upsc|psc|police|constable|si\b|group d|patwari|govt|government/i.test(fullText)) {
      category = 'Government';
    } else if (/army|navy|air force|defence|nda|cds|afcat|crpf|bsf|cisf/i.test(fullText)) {
      category = 'Defence';
    } else if (/teacher|tgt|pgt|prt|professor|lecturer|ctet|tet|ugc net|school/i.test(fullText)) {
      category = 'Teaching';
    } else if (/state|wb|bihar|up\b|rajasthan|delhi|maharashtra|odisha|kerala/i.test(fullText)) {
      category = 'State Exams';
    }
  }

  // Infer Organization
  let organization = item.organization || '';
  if (!organization) {
    const orgMatch = title.match(/^([A-Z0-9\s]{2,10})\b/);
    if (orgMatch && orgMatch[1].trim().length >= 2) {
      organization = orgMatch[1].trim();
    } else if (title.includes('AIIMS')) organization = 'AIIMS';
    else if (title.includes('RRB')) organization = 'Railway Recruitment Board';
    else if (title.includes('SSC')) organization = 'Staff Selection Commission';
    else if (title.includes('UPSC')) organization = 'Union Public Service Commission';
    else if (title.includes('BSNL')) organization = 'BSNL';
    else if (title.includes('SBI')) organization = 'State Bank of India';
    else if (title.includes('WBHRB')) organization = 'WBHRB';
    else if (title.includes('Indian Army')) organization = 'Indian Army';
    else if (title.includes('MPSC')) organization = 'Maharashtra PSC';
    else if (title.includes('Gujarat')) organization = 'Gujarat Govt';
    else organization = 'Govt Recruitment';
  }

  // Infer Vacancies
  let vacancies = item.vacancies || '';
  if (!vacancies) {
    const vacancyMatch = title.match(/(\d+[\d,]*)\s*(?:posts?|vacanc(?:y|ies))/i) || content.match(/(\d+[\d,]*)\s*(?:posts?|vacanc(?:y|ies))/i);
    if (vacancyMatch) {
      vacancies = vacancyMatch[1];
    } else {
      vacancies = 'Multiple';
    }
  }

  const summary = item.website_content?.summary || content
    .replace(/[#*`_\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

  const rawLink = item.website_content?.actual_link || '';
  const actual_link = normalizeExternalUrl(rawLink);

  return {
    category,
    organization,
    vacancies,
    location: item.location || (fullText.includes('remote') ? 'Remote' : 'All India / State'),
    type: item.type || (category === 'Engineering' ? 'Full-Time / Tech' : 'Govt / Regular'),
    date: item.date || new Date().toISOString().split('T')[0],
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
