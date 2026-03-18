'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { contentApi } from '@/lib/api';
import { FileUpload } from '@/components/ui/FileUpload';
import type { ContentPost, CreatePostPayload, Platform, PostType, PostStatus } from '@/types/content';
import toast from 'react-hot-toast';

const PLATFORMS: { value: Platform; label: string; color: string }[] = [
  { value: 'instagram', label: 'Instagram', color: 'bg-pink-100 text-pink-700' },
  { value: 'twitter',   label: 'Twitter/X', color: 'bg-sky-100 text-sky-700' },
  { value: 'facebook',  label: 'Facebook',  color: 'bg-blue-100 text-blue-700' },
  { value: 'linkedin',  label: 'LinkedIn',  color: 'bg-indigo-100 text-indigo-700' },
  { value: 'tiktok',    label: 'TikTok',    color: 'bg-gray-100 text-gray-700' },
  { value: 'youtube',   label: 'YouTube',   color: 'bg-red-100 text-red-700' },
];

const POST_TYPES: { value: PostType; label: string }[] = [
  { value: 'post',   label: 'Post' },
  { value: 'story',  label: 'Story' },
  { value: 'reel',   label: 'Reel' },
  { value: 'video',  label: 'Video' },
  { value: 'thread', label: 'Thread' },
];

interface PostModalProps {
  post?: ContentPost | null;
  defaultDate?: Date;
  onClose: () => void;
  onSaved: (post: ContentPost) => void;
}

export default function PostModal({ post, defaultDate, onClose, onSaved }: PostModalProps) {
  const isEdit = !!post;

  const [form, setForm] = useState<CreatePostPayload>({
    title: post?.title ?? '',
    body: post?.body ?? '',
    platform: post?.platform ?? 'instagram',
    post_type: post?.post_type ?? 'post',
    status: post?.status ?? 'draft',
    scheduled_at: post?.scheduled_at ??
      (defaultDate ? format(defaultDate, "yyyy-MM-dd'T'HH:mm") : null),
    media_urls: post?.media_urls ?? [],
    tags: post?.tags ?? [],
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof CreatePostPayload>(key: K, val: CreatePostPayload[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags!.includes(tag)) {
      set('tags', [...form.tags!, tag]);
    }
    setTagInput('');
  };

  const removeTag = (t: string) =>
    set('tags', form.tags!.filter((x) => x !== t));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        scheduled_at: form.scheduled_at
          ? new Date(form.scheduled_at).toISOString()
          : null,
      };
      const saved = isEdit
        ? await contentApi.update(post!.id, payload)
        : await contentApi.create(payload);
      toast.success(isEdit ? 'Post updated' : 'Post created');
      onSaved(saved);
    } catch {
      toast.error('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">{isEdit ? 'Edit post' : 'New post'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Post title..."
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caption / Body</label>
            <textarea
              value={form.body ?? ''}
              onChange={(e) => set('body', e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Write your caption..."
            />
          </div>

          {/* Platform & Type row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform *</label>
              <select
                value={form.platform}
                onChange={(e) => set('platform', e.target.value as Platform)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                value={form.post_type}
                onChange={(e) => set('post_type', e.target.value as PostType)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {POST_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status & Scheduled at */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value as PostStatus)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Schedule date</label>
              <input
                type="datetime-local"
                value={form.scheduled_at ?? ''}
                onChange={(e) => set('scheduled_at', e.target.value || null)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Media */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Media</label>
            <FileUpload
              onUpload={(file) => set('media_urls', [...(form.media_urls ?? []), file.url])}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Add tag and press Enter"
              />
              <button type="button" onClick={addTag}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                Add
              </button>
            </div>
            {form.tags!.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {form.tags!.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                    #{t}
                    <button type="button" onClick={() => removeTag(t)} className="text-gray-400 hover:text-gray-600">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
