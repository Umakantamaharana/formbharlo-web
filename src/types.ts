import React from 'react';

export type JobStatus = 'UNPUBLISHED' | 'GENERATED' | 'PUBLISHED' | string;

export interface Job {
  id: string;
  website_content: {
    title: string;
    markdown_content: string;
    actual_link: string;
    action: string;
    summary?: string;
  };
  social_posts?: {
    x?: string;
    ln?: string;
    fb?: string;
    ig?: string;
    wp?: string;
    th?: string;
    tg?: string;
  };
  status: JobStatus;
  href: string;
  image_url?: string;
  
  // Categorical & Meta Fields
  category?: 'Government' | 'Banking' | 'Engineering' | 'Healthcare' | 'Defence' | 'Teaching' | 'State Exams' | 'General';
  organization?: string;
  location?: string;
  type?: string;
  salary?: string;
  qualification?: string;
  vacancies?: string;
  deadline?: string;
  date?: string;
  featured?: boolean;
  tags?: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
}