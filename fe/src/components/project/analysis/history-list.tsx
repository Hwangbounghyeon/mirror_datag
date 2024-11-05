import { HistoryListData } from "@/types/historyType";

export async function HistoryList({ projectId }: { projectId: string }) {
  // const requestParams = new URLSearchParams({
  //   page: page.toString(),
  //   limit: limit.toString()
  // });

  const response = await fetch(
    `http://localhost:8000/be/api/history/${projectId}`,
    {
      headers: {
        'Authorization': `bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJlbWFpbCI6IjU1MTYyMzdAa211LmtyIiwiZGVwYXJ0bWVudF9pZCI6MSwiaXNfc3VwZXJ2aXNlZCI6dHJ1ZSwidG9rZW5fdHlwZSI6ImFjY2VzcyIsImV4cCI6MTczMDgyNTg5MH0.B6V4XoEv79rQZ6GbTUEG_6AmZzOf0XY966xK35Vda6w`,
      },
      cache: 'no-store'
    }
  );
  
  console.log(response)

  if (!response.ok) {
    return (
      <div className="flex-grow bg-red-500 overflow-auto flex items-center justify-center text-white">
        데이터 로드 실패
      </div>
    );
  }

  const result = await response.json();
  const histories = result.data;

  return (
    <div className="flex-grow bg-red-500 overflow-auto">
      {histories.data.map((history: HistoryListData) => (
        <div key={history.history_id}>
          {history.history_name}
        </div>
      ))}
    </div>
  );
}