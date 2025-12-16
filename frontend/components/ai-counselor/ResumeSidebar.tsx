// components/ai-counselor/ResumeSidebar.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function ResumeSidebar({ data }: { data: any }) {
  if (!data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Resume</h2>
      
      <div className="mb-6">
        <h3 className="font-semibold">Skills</h3>
        <ul className="list-disc list-inside text-sm">
          {data.skills?.map((skill: string, i: number) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold">Experience</h3>
        <p className="text-sm">{data.experience || 'Not specified'}</p>
      </div>

      <div>
        <h3 className="font-semibold">Projects</h3>
        <ul className="space-y-2">
          {data.projects?.map((proj: any, i: number) => (
            <li key={i} className="text-sm">
              <strong>{proj.title}</strong> — {proj.description.substring(0, 60)}...
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}