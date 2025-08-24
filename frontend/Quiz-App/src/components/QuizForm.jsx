export default function QuestionList({ quizTitle,setQuizTitle,currentQuestion,handleOptionCorrectChange,handleOptionTextChange,handleQuestionTextChange,addOption,addOrUpdateQuestion,editIndex,setEditIndex,setCurrentQuestion }) {
    return(
        <div className="flex-1 p-6">
            <h2 className="text-xl font-semibold mb-4">{editIndex !== null ? 'Edit Question' : 'Add Question'}</h2>
            <div className="space-y-4">

            <div className="mb-4">
                <label className="block mb-1 font-medium">Quiz Title:</label>
                <input
                type="text"
                value={quizTitle}
                onChange={e => setQuizTitle(e.target.value)}
                className="w-full p-2 border rounded"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Question:</label>
                <input type="text" value={currentQuestion.text} onChange={handleQuestionTextChange} className="w-full p-2 border rounded" />
            </div>

            <div>
                <label className="block mb-1 font-medium">Options:</label>
                <div className="space-y-2">
                {currentQuestion.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={opt.text}
                        onChange={e => handleOptionTextChange(idx, e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                        className="p-2 border rounded flex-1"
                    />
                    <label className="flex items-center gap-1 text-sm">
                        <input
                        type="radio"
                        name="correctOption"
                        checked={opt.isCorrect}
                        onChange={() => handleOptionCorrectChange(idx)}
                        />
                        Correct
                    </label>
                    </div>
                ))}
                </div>
                <button type="button" onClick={addOption} className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Add Option</button>
            </div>

            <button type="button" onClick={addOrUpdateQuestion} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{editIndex !== null ? 'Update Question' : 'Add Question'}</button>
            {editIndex !== null && (
                <button type="button" onClick={() => { setCurrentQuestion({ text: '', options: [{ text: '', isCorrect: false }] }); setEditIndex(null); }} className="ml-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancel</button>
            )}
            </div>
        </div>
    )
}