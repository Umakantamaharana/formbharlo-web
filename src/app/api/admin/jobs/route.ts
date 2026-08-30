import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { Job } from '@/types';

// Ensure the token is available
const GITHUB_PAT = process.env.GITHUB_PAT;
const REPO_OWNER = 'Umakantamaharana';
const REPO_NAME = 'job-scrapper-backend';
const FILE_PATH = 'latest_jobs.json';

const octokit = new Octokit({ auth: GITHUB_PAT });

export async function GET() {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${FILE_PATH}`, {
            next: { revalidate: 0 } // ALWAYS fetch fresh data for the admin
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from GitHub');
        }

        const data: Job[] = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Admin API Error reading jobs:', error);
        return NextResponse.json({ error: 'Failed to load jobs' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!GITHUB_PAT) {
        return NextResponse.json({ error: 'GITHUB_PAT is not configured in environment variables' }, { status: 500 });
    }

    try {
        const { action, id, status, link } = await request.json();

        // 1. Fetch current file from GitHub to get the latest SHA (required for updating)
        const { data: fileData } = await octokit.repos.getContent({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: FILE_PATH,
        });

        if (Array.isArray(fileData) || fileData.type !== 'file') {
            throw new Error('Invalid file format returned from GitHub');
        }

        const sha = fileData.sha;

        // Decode current content
        const content = Buffer.from(fileData.content, 'base64').toString('utf8');
        const jobs: Job[] = JSON.parse(content);

        // 2. Perform the requested update
        let updated = false;
        for (const job of jobs) {
            if (String(job.id) === String(id)) {
                if (action === 'update_status' && status) {
                    job.status = status;
                    updated = true;
                } else if (action === 'update_link' && link !== undefined) {
                    if (!job.website_content) {
                        job.website_content = {
                            title: '',
                            markdown_content: '',
                            actual_link: link,
                            action: 'Apply'
                        };
                    } else {
                        job.website_content.actual_link = link;
                    }
                    updated = true;
                }
                break;
            }
        }

        if (!updated) {
            return NextResponse.json({ error: 'Job not found or no changes made' }, { status: 404 });
        }

        // 3. Commit the updated JSON back to GitHub
        const updatedContent = JSON.stringify(jobs, null, 2);

        await octokit.repos.createOrUpdateFileContents({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: FILE_PATH,
            message: `Admin Update: Modified job ${id} via Dashboard`,
            content: Buffer.from(updatedContent).toString('base64'),
            sha: sha, // The blob SHA of the file being replaced
            committer: {
                name: 'Admin Dashboard',
                email: 'admin@career135.com',
            },
        });

        return NextResponse.json({ success: true, message: 'Updated successfully pushed to GitHub' });

    } catch (error: unknown) {
        console.error('Admin API Error updating GitHub:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to update GitHub';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
