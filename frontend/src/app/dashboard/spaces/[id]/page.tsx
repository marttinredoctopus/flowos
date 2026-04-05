'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Plus, Folder, CheckSquare, Kanban, UploadSimple, VideoCamera,
  Info, Trash, PencilSimple, Link, Image, FileText, Play, X,
  Users, CaretDown, DotsSixVertical, Check, Circle,
  SquaresFour, ListBullets, CalendarBlank, CaretLeft, CaretRight,
} from '@phosphor-icons/react';
import { LoadingScreen, Modal, FormField, PriorityBadge, inputStyle, formatDate } from '@/components/ui/shared';
import TaskDetailPanel from '@/components/tasks/TaskDetailPanel';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const KANBAN_COLS = [
  { id: 'todo',        label: 'To Do',       color: '#6b7280' },
  { id: 'in_progress', label: 'In Progress', color: '#7030EF' },
  { id: 'review',      label: 'In Review',   color: '#FFB547' },
  { id: 'done',        label: 'Done',        color: '#00E5A0' },
];
const PROJ_COLORS = ['#7030EF','#DB1FFF','#00D4FF','#00E5A0','#FFB547','#FF4D6A','#6366f1'];
const PROJ_ICONS  = ['📁','🚀','💡','🎯','📱','🛒','✨','🎨','📊'];
const VIDEO_STATUSES = ['draft','in_review','approved','published'];
const VIDEO_STATUS_COLORS: Record<string, string> = { draft:'#6b7280', in_review:'#FFB547', approved:'#00E5A0', published:'#7030EF' };

/* ─── tiny helpers ─────────────────────────────────────────────── */
function formatBytes(b: number) {
  if (!b) return '';
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b/1024).toFixed(1)} KB`;
  return `${(b/1024/1024).toFixed(1)} MB`;
}
function assetIcon(type: string) {
  if (type === 'image') return <Image size={16} color="#7030EF" />;
  if (type === 'video') return <Play size={16} color="#DB1FFF" />;
  if (type === 'link')  return <Link size={16} color="#00D4FF" />;
  return <FileText size={16} color="#FFB547" />;
}

export default function SpaceDetail() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  const [space, setSpace]     = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats]     = useState<any>({});
  const [tasks, setTasks]     = useState<any[]>([]);
  const [assets, setAssets]   = useState<any[]>([]);
  const [videos, setVideos]   = useState<any[]>([]);
  const [teamList, setTeamList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState<'projects'|'tasks'|'assets'|'videos'|'info'>('projects');
  const [taskView, setTaskView] = useState<'board'|'list'|'calendar'>('board');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [calYear, setCalYear]   = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());

  /* drag */
  const [dragging, setDragging] = useState<string|null>(null);
  const [dragOver, setDragOver] = useState<string|null>(null);

  /* modals */
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewTask,    setShowNewTask]    = useState(false);
  const [showNewAsset,   setShowNewAsset]   = useState(false);
  const [showNewVideo,   setShowNewVideo]   = useState(false);
  const [editVideo,      setEditVideo]      = useState<any>(null);
  const [editSpace,      setEditSpace]      = useState(false);

  /* forms */
  const [projForm, setProjForm] = useState({ name:'', description:'', color:'#7030EF', icon:'📁', status:'active' });
  const [taskForm, setTaskForm] = useState({ title:'', project_id:'', status:'todo', priority:'medium', due_date:'', description:'', assignee_id:'' });
  const [assetForm, setAssetForm] = useState({ name:'', asset_type:'link', link_url:'', file_url:'', mime_type:'' });
  const [videoForm, setVideoForm] = useState({ title:'', description:'', caption:'', tov:'', subtitles:'', video_link:'', video_url:'', assigned_to:'', status:'draft' });
  const [infoForm, setInfoForm]   = useState({ tov:'', brand_links: [] as {label:string;url:string}[] });
  const [saving, setSaving]       = useState(false);
  const [assetFilter, setAssetFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ─── Load ─────────────────────────────────────────────────── */
  useEffect(() => {
    load();
    apiGet('/api/team').then(r => setTeamList(Array.isArray(r) ? r : [])).catch(() => {});
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const [spRes, tRes, aRes, vRes] = await Promise.all([
        apiGet(`/api/spaces/${id}`),
        apiGet(`/api/spaces/${id}/tasks`),
        apiGet(`/api/spaces/${id}/assets`),
        apiGet(`/api/spaces/${id}/videos`),
      ]);
      setSpace(spRes.space);
      setMembers(spRes.members || []);
      setProjects(spRes.projects || []);
      setStats(spRes.stats || {});
      setTasks(tRes.tasks || []);
      setAssets(aRes.assets || []);
      setVideos(vRes.videos || []);
      setInfoForm({ tov: spRes.space.tov || '', brand_links: spRes.space.brand_links || [] });
    } catch { toast.error('Failed to load space'); }
    finally { setLoading(false); }
  }

  /* ─── Kanban drag ───────────────────────────────────────────── */
  async function moveTask(taskId: string, newStatus: string) {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try { await apiPatch(`/api/tasks/${taskId}`, { status: newStatus }); }
    catch { toast.error('Failed to move task'); }
  }

  /* ─── Save helpers ──────────────────────────────────────────── */
  async function saveProject() {
    if (!projForm.name.trim()) return toast.error('Name required');
    setSaving(true);
    try {
      const res = await apiPost(`/api/spaces/${id}/projects`, projForm);
      setProjects(prev => [res.project, ...prev]);
      setShowNewProject(false);
      setProjForm({ name:'', description:'', color:'#7030EF', icon:'📁', status:'active' });
      toast.success('Project created');
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  }

  async function saveTask() {
    if (!taskForm.title.trim()) return toast.error('Title required');
    if (!taskForm.project_id) return toast.error('Select a project');
    setSaving(true);
    try {
      const res = await apiPost(`/api/spaces/${id}/tasks`, taskForm);
      setTasks(prev => [res.task, ...prev]);
      setShowNewTask(false);
      setTaskForm({ title:'', project_id:'', status:'todo', priority:'medium', due_date:'', description:'', assignee_id:'' });
      toast.success('Task created');
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  }

  async function saveAsset() {
    if (!assetForm.name.trim()) return toast.error('Name required');
    setSaving(true);
    try {
      const res = await apiPost(`/api/spaces/${id}/assets`, assetForm);
      setAssets(prev => [res.asset, ...prev]);
      setShowNewAsset(false);
      setAssetForm({ name:'', asset_type:'link', link_url:'', file_url:'', mime_type:'' });
      toast.success('Asset added');
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  }

  async function saveVideo() {
    const form = editVideo ? videoForm : videoForm;
    if (!form.title.trim()) return toast.error('Title required');
    setSaving(true);
    try {
      if (editVideo) {
        const res = await apiPatch(`/api/spaces/${id}/videos/${editVideo.id}`, form);
        setVideos(prev => prev.map(v => v.id === editVideo.id ? res.video : v));
        toast.success('Video updated');
      } else {
        const res = await apiPost(`/api/spaces/${id}/videos`, form);
        setVideos(prev => [res.video, ...prev]);
        toast.success('Video created');
      }
      setShowNewVideo(false);
      setEditVideo(null);
      setVideoForm({ title:'', description:'', caption:'', tov:'', subtitles:'', video_link:'', video_url:'', assigned_to:'', status:'draft' });
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  }

  async function saveInfo() {
    setSaving(true);
    try {
      await apiPatch(`/api/spaces/${id}`, infoForm);
      toast.success('Info saved');
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  }

  async function deleteAsset(assetId: string) {
    try {
      await apiDelete(`/api/spaces/${id}/assets/${assetId}`);
      setAssets(prev => prev.filter(a => a.id !== assetId));
    } catch { toast.error('Failed'); }
  }

  async function deleteVideo(videoId: string) {
    if (!confirm('Delete this video?')) return;
    try {
      await apiDelete(`/api/spaces/${id}/videos/${videoId}`);
      setVideos(prev => prev.filter(v => v.id !== videoId));
    } catch { toast.error('Failed'); }
  }

  /* ─── File upload ───────────────────────────────────────────── */
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = (window as any).__TASKSDONE_AUTH_TOKEN__;
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'spaces');
      const r = await fetch(`${API}/upload/single`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!r.ok) throw new Error('Upload failed');
      const data = await r.json();
      const url = data.url || data.data?.url;
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const assetType = isImage ? 'image' : isVideo ? 'video' : 'document';
      const res = await apiPost(`/api/spaces/${id}/assets`, {
        name: file.name,
        asset_type: assetType,
        file_url: url,
        mime_type: file.type,
        size_bytes: file.size,
      });
      setAssets(prev => [res.asset, ...prev]);
      toast.success('File uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  }

  function handleTaskUpdate(updated: any) {
    setTasks(prev => prev.map(t => t.id === updated.id ? { ...t, ...updated } : t));
    setSelectedTask((prev: any) => prev ? { ...prev, ...updated } : prev);
  }

  function tasksOnDay(day: number) {
    return tasks.filter((t: any) => {
      if (!t.due_date) return false;
      const d = new Date(t.due_date);
      return d.getFullYear() === calYear && d.getMonth() === calMonth && d.getDate() === day;
    });
  }

  function calDays() {
    const first = new Date(calYear, calMonth, 1).getDay();
    const total = new Date(calYear, calMonth + 1, 0).getDate();
    return { first, total };
  }

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const colColor = (status: string) => KANBAN_COLS.find(c => c.id === status)?.color || '#6b7280';

  if (loading) return <LoadingScreen />;
  if (!space) return <div style={{ padding: 40, color: 'var(--text-muted)' }}>Space not found</div>;

  const spaceColor = space.color || '#7030EF';
  const filteredAssets = assetFilter === 'all' ? assets : assets.filter((a: any) => a.asset_type === assetFilter);

  /* ─── RENDER ────────────────────────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Top bar */}
      <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 40 }}>
        <button onClick={() => router.push('/dashboard/spaces')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>
          <ArrowLeft size={14} /> Spaces
        </button>

        <div style={{ width: 1, height: 24, background: 'var(--border)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `${spaceColor}22`, border: `2px solid ${spaceColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, color: spaceColor, flexShrink: 0 }}>
            {space.name[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{space.name}</div>
            {space.client_name && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{space.client_name}</div>}
          </div>
        </div>

        {/* stats pills */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: `${stats.total_tasks||0} tasks`,    color:'#00E5A0' },
            { label: `${projects.length} projects`,       color:'#7030EF' },
            { label: `${stats.asset_count||0} assets`,    color:'#FFB547' },
            { label: `${stats.video_count||0} videos`,    color:'#DB1FFF' },
          ].map(p => (
            <span key={p.label} style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 99, background: `${p.color}15`, color: p.color }}>{p.label}</span>
          ))}
        </div>

        {/* Member avatars */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {members.slice(0, 4).map((m: any, i: number) => (
            <div key={m.id} style={{ width: 30, height: 30, borderRadius: '50%', background: `${spaceColor}22`, border: `2px solid var(--card)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: spaceColor, marginLeft: i > 0 ? -8 : 0, zIndex: 10 - i }}>
              {m.name[0].toUpperCase()}
            </div>
          ))}
          {members.length > 4 && <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--surface)', border: '2px solid var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--text-muted)', marginLeft: -8 }}>+{members.length-4}</div>}
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '0 28px', display: 'flex', gap: 0 }}>
        {([
          { id:'projects', Icon:Folder,       label:'Projects' },
          { id:'tasks',    Icon:Kanban,        label:'Tasks' },
          { id:'assets',   Icon:Image,         label:'Assets Hub' },
          { id:'videos',   Icon:VideoCamera,   label:'Videos Hub' },
          { id:'info',     Icon:Info,          label:'Client Info' },
        ] as const).map(({ id:tid, Icon, label }) => (
          <button key={tid} onClick={() => setTab(tid)}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '14px 18px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: tab === tid ? 700 : 500, color: tab === tid ? spaceColor : 'var(--text-muted)', borderBottom: tab === tid ? `2px solid ${spaceColor}` : '2px solid transparent', transition: 'all 0.15s', marginBottom: -1 }}>
            <Icon size={15} weight={tab === tid ? 'fill' : 'regular'} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '24px 28px' }}>

        {/* ── PROJECTS ─────────────────────────────────────────── */}
        {tab === 'projects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Projects ({projects.length})</h2>
              <button onClick={() => setShowNewProject(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${spaceColor},#DB1FFF)`, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                <Plus size={14} weight="bold" /> New Project
              </button>
            </div>
            {projects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card)', borderRadius: 16, border: '1px solid var(--border)' }}>
                <Folder size={40} color="var(--text-muted)" style={{ marginBottom: 12 }} />
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No projects yet. Create the first project for this space.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
                {projects.map((p: any) => {
                  const pct = p.task_count > 0 ? Math.round((p.done_count / p.task_count) * 100) : 0;
                  return (
                    <div key={p.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', transition: 'all 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 8px 24px rgba(0,0,0,0.12)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform='none'; (e.currentTarget as HTMLElement).style.boxShadow='none'; }}>
                      <div style={{ height: 3, background: p.color || '#7030EF' }} />
                      <div style={{ padding: '16px 16px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 9, background: `${p.color||'#7030EF'}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                            {p.icon || '📁'}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.task_count||0} tasks · {pct}% done</div>
                          </div>
                        </div>
                        {p.description && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.5, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' as any }}>{p.description}</p>}
                        <div style={{ height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 99, width: `${pct}%`, background: p.color||'#7030EF', transition: 'width 0.4s' }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TASKS ────────────────────────────────────────────── */}
        {tab === 'tasks' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Tasks ({tasks.length})</h2>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {/* View toggle */}
                <div style={{ display: 'flex', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                  {([['board', SquaresFour], ['list', ListBullets], ['calendar', CalendarBlank]] as const).map(([v, Icon]) => (
                    <button key={v} onClick={() => setTaskView(v as any)}
                      style={{ padding: '7px 12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, background: taskView === v ? `linear-gradient(135deg,${spaceColor},#DB1FFF)` : 'transparent', color: taskView === v ? 'white' : 'var(--text-muted)', transition: 'all 0.15s' }}>
                      <Icon size={14} />{(v as string).charAt(0).toUpperCase() + (v as string).slice(1)}
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowNewTask(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${spaceColor},#DB1FFF)`, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  <Plus size={14} weight="bold" /> New Task
                </button>
              </div>
            </div>

            {/* Board view */}
            {taskView === 'board' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, alignItems: 'start' }}>
                {KANBAN_COLS.map(col => {
                  const colTasks = tasks.filter((t: any) => (t.status||'todo') === col.id);
                  const isOver = dragOver === col.id;
                  return (
                    <div key={col.id}
                      onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
                      onDragLeave={() => setDragOver(null)}
                      onDrop={e => { e.preventDefault(); if (dragging) moveTask(dragging, col.id); setDragging(null); setDragOver(null); }}
                      style={{ background: isOver ? `${col.color}12` : 'var(--surface)', border: `1px solid ${isOver ? col.color : 'var(--border)'}`, borderRadius: 14, padding: 12, minHeight: 200, transition: 'all 0.15s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: col.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{col.label}</span>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', background: 'var(--card)', padding: '2px 7px', borderRadius: 99 }}>{colTasks.length}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {colTasks.map((task: any) => (
                          <div key={task.id}
                            draggable
                            onDragStart={() => setDragging(task.id)}
                            onDragEnd={() => { setDragging(null); setDragOver(null); }}
                            onClick={() => setSelectedTask(task)}
                            style={{ background: 'var(--card)', border: `1px solid ${selectedTask?.id === task.id ? col.color : 'var(--border)'}`, borderLeft: `3px solid ${col.color}`, borderRadius: 8, padding: '10px 12px', cursor: 'pointer', opacity: dragging === task.id ? 0.5 : 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 8, lineHeight: 1.4 }}>{task.title}</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                              <PriorityBadge priority={task.priority||'medium'} />
                              {task.project_name && <span style={{ fontSize: 10, color: 'var(--text-muted)', background: 'var(--surface)', padding: '2px 6px', borderRadius: 4 }}>{task.project_name}</span>}
                            </div>
                            {task.due_date && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6 }}>📅 {formatDate(task.due_date)}</div>}
                          </div>
                        ))}
                        <button onClick={() => { setTaskForm(f => ({ ...f, status: col.id })); setShowNewTask(true); }}
                          style={{ width: '100%', padding: '7px', borderRadius: 8, border: '1px dashed var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = col.color; (e.currentTarget as HTMLButtonElement).style.color = col.color; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}>
                          + Add task
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* List view */}
            {taskView === 'list' && (
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 100px 80px', gap: 0, padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
                  {['Task', 'Project', 'Priority', 'Due Date', ''].map(h => (
                    <span key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
                  ))}
                </div>
                {tasks.map((task: any, i: number) => (
                  <div key={task.id} onClick={() => setSelectedTask(task)}
                    style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 100px 80px', gap: 0, padding: '12px 16px', borderBottom: i < tasks.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', background: selectedTask?.id === task.id ? `${spaceColor}08` : 'transparent', transition: 'background 0.1s' }}
                    onMouseEnter={e => { if (selectedTask?.id !== task.id) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.02)'; }}
                    onMouseLeave={e => { if (selectedTask?.id !== task.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: colColor(task.status||'todo'), flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{task.title}</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>{task.project_name || '—'}</span>
                    <div style={{ alignSelf: 'center' }}><PriorityBadge priority={task.priority||'medium'} /></div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>{task.due_date ? formatDate(task.due_date) : '—'}</span>
                    <div style={{ alignSelf: 'center', display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={e => { e.stopPropagation(); if (confirm('Delete?')) { apiDelete(`/api/tasks/${task.id}`).then(() => setTasks(p => p.filter(t => t.id !== task.id))); }}} style={{ padding: '4px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: '#FF4D6A', display: 'flex', alignItems: 'center' }}><Trash size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Calendar view */}
            {taskView === 'calendar' && (() => {
              const { first, total } = calDays();
              const cells = Array.from({ length: first + total }, (_, i) => i < first ? null : i - first + 1);
              while (cells.length % 7 !== 0) cells.push(null);
              const today = new Date();
              return (
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                    <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}
                      style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center' }}>
                      <CaretLeft size={14} />
                    </button>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{MONTHS[calMonth]} {calYear}</span>
                    <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}
                      style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center' }}>
                      <CaretRight size={14} />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid var(--border)' }}>
                    {WEEKDAYS.map(d => <div key={d} style={{ padding: '8px 0', textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{d}</div>)}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
                    {cells.map((day, idx) => {
                      const isToday = day !== null && today.getFullYear() === calYear && today.getMonth() === calMonth && today.getDate() === day;
                      const dayTasks = day ? tasksOnDay(day) : [];
                      return (
                        <div key={idx} style={{ minHeight: 80, padding: '6px 8px', borderRight: (idx + 1) % 7 !== 0 ? '1px solid var(--border)' : 'none', borderBottom: idx < cells.length - 7 ? '1px solid var(--border)' : 'none', background: day === null ? 'rgba(0,0,0,0.02)' : 'transparent' }}>
                          {day && (
                            <>
                              <div style={{ width: 22, height: 22, borderRadius: '50%', background: isToday ? `linear-gradient(135deg,${spaceColor},#DB1FFF)` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: isToday ? 700 : 400, color: isToday ? 'white' : 'var(--text-muted)', marginBottom: 3 }}>{day}</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {dayTasks.slice(0, 3).map((t: any) => (
                                  <div key={t.id} onClick={() => setSelectedTask(t)}
                                    style={{ fontSize: 10, padding: '2px 5px', borderRadius: 4, background: `${colColor(t.status||'todo')}22`, color: colColor(t.status||'todo'), fontWeight: 600, cursor: 'pointer', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                    {t.title}
                                  </div>
                                ))}
                                {dayTasks.length > 3 && <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>+{dayTasks.length - 3} more</span>}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Task Detail Panel */}
        {selectedTask && (
          <TaskDetailPanel
            task={selectedTask}
            projects={projects}
            onClose={() => setSelectedTask(null)}
            onUpdate={handleTaskUpdate}
            onDelete={(taskId) => { apiDelete(`/api/tasks/${taskId}`).then(() => { setTasks(p => p.filter(t => t.id !== taskId)); setSelectedTask(null); }).catch(() => toast.error('Failed to delete')); }}
          />
        )}

        {/* ── ASSETS HUB ───────────────────────────────────────── */}
        {tab === 'assets' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Assets Hub ({assets.length})</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={handleFileUpload} accept="image/*,video/*,.pdf,.doc,.docx,.zip" />
                <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  <UploadSimple size={14} /> {uploading ? 'Uploading...' : 'Upload File'}
                </button>
                <button onClick={() => setShowNewAsset(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${spaceColor},#DB1FFF)`, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  <Link size={14} /> Add Link
                </button>
              </div>
            </div>

            {/* Type filter */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {['all','image','video','document','link'].map(t => (
                <button key={t} onClick={() => setAssetFilter(t)}
                  style={{ padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, border: '1px solid', cursor: 'pointer', borderColor: assetFilter === t ? spaceColor : 'var(--border)', background: assetFilter === t ? `${spaceColor}15` : 'transparent', color: assetFilter === t ? spaceColor : 'var(--text-muted)', transition: 'all 0.15s', textTransform: 'capitalize' }}>
                  {t === 'all' ? `All (${assets.length})` : t}
                </button>
              ))}
            </div>

            {filteredAssets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card)', borderRadius: 16, border: '1px solid var(--border)' }}>
                <Image size={40} color="var(--text-muted)" style={{ marginBottom: 12 }} />
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No assets yet. Upload files or add links.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
                {filteredAssets.map((a: any) => (
                  <div key={a.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', transition: 'all 0.2s', position: 'relative', group: true } as any}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow='0 6px 20px rgba(0,0,0,0.12)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow='none'; }}>
                    {/* Preview */}
                    {a.asset_type === 'image' && a.file_url ? (
                      <div style={{ height: 130, overflow: 'hidden', background: 'var(--surface)' }}>
                        <img src={a.file_url} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{ height: 80, background: `${spaceColor}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {assetIcon(a.asset_type)}
                      </div>
                    )}
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>{a.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{a.asset_type}{a.size_bytes ? ` · ${formatBytes(a.size_bytes)}` : ''}</span>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {a.file_url && <a href={a.file_url} target="_blank" rel="noreferrer" style={{ padding: '3px 6px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 10, cursor: 'pointer', textDecoration: 'none' }}>Open</a>}
                          {a.link_url && <a href={a.link_url} target="_blank" rel="noreferrer" style={{ padding: '3px 6px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 10, cursor: 'pointer', textDecoration: 'none' }}>Visit</a>}
                          <button onClick={() => deleteAsset(a.id)} style={{ padding: '3px 5px', borderRadius: 6, border: '1px solid rgba(255,77,106,0.2)', background: 'transparent', color: '#FF4D6A', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Trash size={11} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── VIDEOS HUB ───────────────────────────────────────── */}
        {tab === 'videos' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Videos Hub ({videos.length})</h2>
              <button onClick={() => { setEditVideo(null); setVideoForm({ title:'', description:'', caption:'', tov:'', subtitles:'', video_link:'', video_url:'', assigned_to:'', status:'draft' }); setShowNewVideo(true); }}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${spaceColor},#DB1FFF)`, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                <Plus size={14} weight="bold" /> New Video
              </button>
            </div>
            {videos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card)', borderRadius: 16, border: '1px solid var(--border)' }}>
                <VideoCamera size={40} color="var(--text-muted)" style={{ marginBottom: 12 }} />
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No videos yet. Create your first video brief.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {videos.map((v: any) => (
                  <div key={v.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderLeft: `3px solid ${VIDEO_STATUS_COLORS[v.status]||'#6b7280'}`, borderRadius: 14, padding: '16px 20px', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow='0 4px 16px rgba(0,0,0,0.1)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow='none'; }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <VideoCamera size={15} color={VIDEO_STATUS_COLORS[v.status]||'#6b7280'} weight="fill" />
                          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{v.title}</span>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: `${VIDEO_STATUS_COLORS[v.status]||'#6b7280'}20`, color: VIDEO_STATUS_COLORS[v.status]||'#6b7280', textTransform: 'capitalize' }}>{v.status}</span>
                        </div>
                        {v.description && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.5 }}>{v.description}</p>}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 8 }}>
                          {v.caption && <div style={{ background: 'var(--surface)', borderRadius: 8, padding: '8px 12px' }}><div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase' }}>Caption</div><div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.4 }}>{v.caption}</div></div>}
                          {v.tov && <div style={{ background: 'var(--surface)', borderRadius: 8, padding: '8px 12px' }}><div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase' }}>TOV</div><div style={{ fontSize: 12, color: 'var(--text)' }}>{v.tov}</div></div>}
                          {v.subtitles && <div style={{ background: 'var(--surface)', borderRadius: 8, padding: '8px 12px' }}><div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase' }}>Subtitles</div><div style={{ fontSize: 12, color: 'var(--text)' }}>{v.subtitles}</div></div>}
                        </div>
                        {v.assignee_name && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>👤 {v.assignee_name}</div>}
                        {(v.video_link || v.video_url) && (
                          <a href={v.video_link || v.video_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: spaceColor, marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                            <Play size={12} /> View video
                          </a>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'flex-start' }}>
                        <button
                          title="Create task from this video"
                          onClick={() => {
                            setTaskForm(f => ({
                              ...f,
                              title: `Video: ${v.title}`,
                              description: v.description || '',
                              status: 'todo',
                              project_id: projects[0]?.id || '',
                            }));
                            setShowNewTask(true);
                          }}
                          style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${spaceColor}44`, background: `${spaceColor}10`, cursor: 'pointer', color: spaceColor, display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600 }}>
                          <CheckSquare size={13} /> Task
                        </button>
                        <button onClick={() => { setEditVideo(v); setVideoForm({ title:v.title, description:v.description||'', caption:v.caption||'', tov:v.tov||'', subtitles:v.subtitles||'', video_link:v.video_link||'', video_url:v.video_url||'', assigned_to:v.assigned_to||'', status:v.status||'draft' }); setShowNewVideo(true); }}
                          style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}><PencilSimple size={13} /></button>
                        <button onClick={() => deleteVideo(v.id)} style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid rgba(255,77,106,0.2)', background: 'transparent', cursor: 'pointer', color: '#FF4D6A', display: 'flex', alignItems: 'center' }}><Trash size={13} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CLIENT INFO ───────────────────────────────────────── */}
        {tab === 'info' && (
          <div style={{ maxWidth: 800 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Client Info</h2>

            {/* Client details (read-only from linked client) */}
            {space.client_name && (
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px', marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Contact Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { label:'Company', val: space.client_company || space.client_name },
                    { label:'Email', val: space.client_email },
                    { label:'Phone', val: space.client_phone },
                    { label:'Website', val: space.client_website },
                  ].filter(f => f.val).map(f => (
                    <div key={f.label} style={{ background: 'var(--surface)', borderRadius: 10, padding: '10px 14px' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 2 }}>{f.label}</div>
                      <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{f.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Editable info */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Brand & Strategy</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <FormField label="Tone of Voice (TOV)">
                  <textarea value={infoForm.tov} onChange={e => setInfoForm({ ...infoForm, tov: e.target.value })} placeholder="Describe the client's tone of voice, personality, and communication style..." rows={4} style={{ ...inputStyle, resize: 'none' }} />
                </FormField>

                <FormField label="Important Links">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {infoForm.brand_links.map((link, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input value={link.label} onChange={e => { const links = [...infoForm.brand_links]; links[i] = { ...links[i], label: e.target.value }; setInfoForm({ ...infoForm, brand_links: links }); }} placeholder="Label (e.g. Drive, Ads Manager)" style={{ ...inputStyle, flex: 1 }} />
                        <input value={link.url} onChange={e => { const links = [...infoForm.brand_links]; links[i] = { ...links[i], url: e.target.value }; setInfoForm({ ...infoForm, brand_links: links }); }} placeholder="https://..." style={{ ...inputStyle, flex: 2 }} />
                        <button onClick={() => setInfoForm({ ...infoForm, brand_links: infoForm.brand_links.filter((_,j) => j !== i) })} style={{ padding: '8px', borderRadius: 8, border: '1px solid rgba(255,77,106,0.2)', background: 'transparent', color: '#FF4D6A', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={13} /></button>
                      </div>
                    ))}
                    <button onClick={() => setInfoForm({ ...infoForm, brand_links: [...infoForm.brand_links, { label:'', url:'' }] })} style={{ padding: '8px 14px', borderRadius: 8, border: '1px dashed var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', textAlign: 'left' }}>+ Add link</button>
                  </div>
                </FormField>

                <button onClick={saveInfo} disabled={saving} style={{ padding: '11px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${spaceColor},#DB1FFF)`, color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving...' : 'Save Info'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── MODALS ──────────────────────────────────────────────── */}

      {/* New Project */}
      {showNewProject && (
        <Modal title="New Project" onClose={() => setShowNewProject(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FormField label="Project Name *">
              <input value={projForm.name} onChange={e => setProjForm({ ...projForm, name: e.target.value })} placeholder="e.g. Social Media Q1" style={inputStyle} autoFocus />
            </FormField>
            <FormField label="Description">
              <textarea value={projForm.description} onChange={e => setProjForm({ ...projForm, description: e.target.value })} placeholder="What is this project about?" rows={3} style={{ ...inputStyle, resize: 'none' }} />
            </FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Status">
                <select value={projForm.status} onChange={e => setProjForm({ ...projForm, status: e.target.value })} style={inputStyle}>
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </FormField>
              <FormField label="Icon">
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {PROJ_ICONS.map(icon => (
                    <button key={icon} type="button" onClick={() => setProjForm({ ...projForm, icon })} style={{ width: 32, height: 32, borderRadius: 7, border: projForm.icon === icon ? `2px solid ${spaceColor}` : '2px solid var(--border)', background: projForm.icon === icon ? `${spaceColor}20` : 'var(--surface)', cursor: 'pointer', fontSize: 16 }}>{icon}</button>
                  ))}
                </div>
              </FormField>
            </div>
            <FormField label="Color">
              <div style={{ display: 'flex', gap: 8 }}>
                {PROJ_COLORS.map(c => (
                  <div key={c} onClick={() => setProjForm({ ...projForm, color: c })} style={{ width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer', border: projForm.color === c ? '3px solid white' : '3px solid transparent', boxShadow: projForm.color === c ? `0 0 0 2px ${c}` : 'none', transition: 'all 0.15s' }} />
                ))}
              </div>
            </FormField>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button onClick={saveProject} disabled={saving} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${spaceColor},#DB1FFF)`, color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Creating...' : 'Create Project'}
              </button>
              <button onClick={() => setShowNewProject(false)} style={{ padding: '11px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {/* New Task */}
      {showNewTask && (
        <Modal title="New Task" onClose={() => setShowNewTask(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FormField label="Task Title *">
              <input value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="What needs to be done?" style={inputStyle} autoFocus />
            </FormField>
            <FormField label="Project *">
              <select value={taskForm.project_id} onChange={e => setTaskForm({ ...taskForm, project_id: e.target.value })} style={inputStyle}>
                <option value="">Select project...</option>
                {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Priority">
                <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })} style={inputStyle}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </FormField>
              <FormField label="Status">
                <select value={taskForm.status} onChange={e => setTaskForm({ ...taskForm, status: e.target.value })} style={inputStyle}>
                  {KANBAN_COLS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </FormField>
            </div>
            <FormField label="Assign To">
              <select value={taskForm.assignee_id} onChange={e => setTaskForm({ ...taskForm, assignee_id: e.target.value })} style={inputStyle}>
                <option value="">Unassigned</option>
                {teamList.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </FormField>
            <FormField label="Due Date">
              <input type="date" value={taskForm.due_date} onChange={e => setTaskForm({ ...taskForm, due_date: e.target.value })} style={inputStyle} />
            </FormField>
            <FormField label="Description">
              <textarea value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="Add details..." rows={3} style={{ ...inputStyle, resize: 'none' }} />
            </FormField>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={saveTask} disabled={saving} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${spaceColor},#DB1FFF)`, color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Creating...' : 'Create Task'}
              </button>
              <button onClick={() => setShowNewTask(false)} style={{ padding: '11px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Link Asset */}
      {showNewAsset && (
        <Modal title="Add Link" onClose={() => setShowNewAsset(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FormField label="Name *">
              <input value={assetForm.name} onChange={e => setAssetForm({ ...assetForm, name: e.target.value })} placeholder="e.g. Google Drive, Figma File" style={inputStyle} autoFocus />
            </FormField>
            <FormField label="URL *">
              <input value={assetForm.link_url} onChange={e => setAssetForm({ ...assetForm, link_url: e.target.value })} placeholder="https://..." style={inputStyle} />
            </FormField>
            <FormField label="Type">
              <select value={assetForm.asset_type} onChange={e => setAssetForm({ ...assetForm, asset_type: e.target.value })} style={inputStyle}>
                <option value="link">Link</option>
                <option value="document">Document</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </FormField>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={saveAsset} disabled={saving} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${spaceColor},#DB1FFF)`, color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Adding...' : 'Add Asset'}
              </button>
              <button onClick={() => setShowNewAsset(false)} style={{ padding: '11px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {/* New / Edit Video */}
      {showNewVideo && (
        <Modal title={editVideo ? 'Edit Video' : 'New Video'} onClose={() => { setShowNewVideo(false); setEditVideo(null); }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '70vh', overflowY: 'auto', paddingRight: 4 }}>
            <FormField label="Title *">
              <input value={videoForm.title} onChange={e => setVideoForm({ ...videoForm, title: e.target.value })} placeholder="Video title" style={inputStyle} autoFocus />
            </FormField>
            <FormField label="Description">
              <textarea value={videoForm.description} onChange={e => setVideoForm({ ...videoForm, description: e.target.value })} placeholder="What is this video about?" rows={2} style={{ ...inputStyle, resize: 'none' }} />
            </FormField>
            <FormField label="Caption (Social Media Copy)">
              <textarea value={videoForm.caption} onChange={e => setVideoForm({ ...videoForm, caption: e.target.value })} placeholder="Write the caption for this video post..." rows={3} style={{ ...inputStyle, resize: 'none' }} />
            </FormField>
            <FormField label="Tone of Voice (TOV)">
              <input value={videoForm.tov} onChange={e => setVideoForm({ ...videoForm, tov: e.target.value })} placeholder="e.g. Professional, Fun, Inspiring..." style={inputStyle} />
            </FormField>
            <FormField label="Subtitles">
              <textarea value={videoForm.subtitles} onChange={e => setVideoForm({ ...videoForm, subtitles: e.target.value })} placeholder="Paste subtitles or script here..." rows={3} style={{ ...inputStyle, resize: 'none' }} />
            </FormField>
            <FormField label="Video Link">
              <input value={videoForm.video_link} onChange={e => setVideoForm({ ...videoForm, video_link: e.target.value })} placeholder="YouTube, Drive, Vimeo URL..." style={inputStyle} />
            </FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Status">
                <select value={videoForm.status} onChange={e => setVideoForm({ ...videoForm, status: e.target.value })} style={inputStyle}>
                  {VIDEO_STATUSES.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
                </select>
              </FormField>
              <FormField label="Assign To">
                <select value={videoForm.assigned_to} onChange={e => setVideoForm({ ...videoForm, assigned_to: e.target.value })} style={inputStyle}>
                  <option value="">Unassigned</option>
                  {teamList.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </FormField>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={saveVideo} disabled={saving} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${spaceColor},#DB1FFF)`, color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : editVideo ? 'Save Changes' : 'Create Video'}
              </button>
              <button onClick={() => { setShowNewVideo(false); setEditVideo(null); }} style={{ padding: '11px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
