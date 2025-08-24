export default function QuestionList({ quizTitle, questions, onEdit, onDelete, handleSubmitQuiz }) {

    return(
        <div className="flex-1 p-6 border-l border-gray-300 bg-white">
            <h2 className="text-xl font-semibold mb-4">Added Questions</h2>
            <div className="mb-2 text-lg font-bold">Quiz Title: {quizTitle || <span className="text-gray-400">(No title)</span>}</div>
            {questions.length === 0 && <div className="text-gray-500">No questions added yet.</div>}
            {questions.length > 0 && <div>
                    <button onClick={handleSubmitQuiz} className="px-4 mb-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit Quiz</button>
                </div >  
            }
            {questions.length > 0 && <div className="text-gray-500">Total Questions: {questions.length}</div>}
            <div className="space-y-4">
            {questions.map((q, qIdx) => (
                <div key={qIdx} className="p-3 border rounded bg-gray-50">
                <div className="flex justify-between items-center mb-1">
                    <div className="font-medium"><strong>Q{qIdx + 1}:</strong> {q.text}</div>
                    <div className="flex gap-2">
                    <button onClick={() => onEdit(qIdx)} className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200">Edit</button>
                    <button onClick={() => onDelete(qIdx)} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
                    </div>
                </div>
                <ul className="list-disc ml-6">
                    {q.options.map((opt, oIdx) => (
                    <li key={oIdx} className={opt.isCorrect ? "text-green-700" : ""}>
                        {opt.text} 
                    </li>
                    ))}
                </ul>
                </div>
            ))}
            </div>
        </div>
    )
}