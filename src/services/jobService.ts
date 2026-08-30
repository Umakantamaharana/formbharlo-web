import { Job } from '../types';

export const fetchJobs = async (): Promise<Job[]> => {
  try {
    const res = await fetch('/api/jobs');
    if (!res.ok) {
      throw new Error(`Failed to fetch jobs from API: ${res.statusText}`);
    }
    const data: Job[] = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching jobs client-side:', error);
    return [];
  }
};

export const getJobById = async (id: string): Promise<Job | undefined> => {
  const jobs = await fetchJobs();
  return jobs.find((job) => String(job.id) === String(id));
};