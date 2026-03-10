export type Platform = 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube';
export type PostType = 'post' | 'story' | 'reel' | 'video' | 'thread';
export type PostStatus = 'draft' | 'scheduled' | 'published';

export interface ContentPost {
  id: string;
  workspace_id: string;
  created_by: string;
  title: string;
  body?: string;
  platform: Platform;
  post_type: PostType;
  status: PostStatus;
  scheduled_at?: string | null;
  published_at?: string | null;
  media_urls: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CalendarDay {
  [day: number]: ContentPost[];
}

export interface CalendarView {
  year: number;
  month: number;
  byDay: CalendarDay;
}

export interface UploadedFile {
  url: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  type: 'image' | 'video' | 'document';
}

export interface CreatePostPayload {
  title: string;
  body?: string;
  platform: Platform;
  post_type: PostType;
  status: PostStatus;
  scheduled_at?: string | null;
  media_urls?: string[];
  tags?: string[];
}
