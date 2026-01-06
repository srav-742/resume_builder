interface Props {
  onSelectMode: (mode: string) => void;
}

export default function WelcomeScreen({ onSelectMode }: Props) {
  return (
    <div className="welcome-card">
      <p className="text-lg font-semibold">
        Hey there, welcome to AI Career Counsellor! 😊
      </p>

      <p className="mt-2">Choose an option below to get started:</p>

      <div className="space-y-2 mt-4">
        

        <button onClick={() => onSelectMode('GAP_ANALYSIS')}>
          🎯 Gap Analysis
        </button>

        <button onClick={() => onSelectMode('MOCK_INTERVIEW')}>
          🎤 Mock Interview
        </button>

        <button onClick={() => onSelectMode('TECH_QUIZ')}>
          🧠 Tech Quiz
        </button>

        <button onClick={() => onSelectMode('RESUME_BUILDING')}>
          📝 Resume Building
        </button>

        <button onClick={() => onSelectMode('CAREER_COUNSELLING')}>
          💼 Career Counselling
        </button>
      </div>
    </div>
  );
}
