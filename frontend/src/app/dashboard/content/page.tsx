import ContentCalendar from '@/components/content/ContentCalendar';

export const metadata = { title: 'Content Calendar — FlowOS' };

export default function ContentPage() {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Content Calendar</h1>
        <p className="text-sm text-gray-500 mt-1">Plan and schedule your social media posts</p>
      </div>
      <div className="flex-1 min-h-0">
        <ContentCalendar />
      </div>
    </div>
  );
}
