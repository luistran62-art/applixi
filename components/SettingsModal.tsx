import React, { useState, useRef } from 'react';
import { X, Plus, Trash, Save, Download, FileUp } from 'lucide-react';
import { DEFAULT_QUESTIONS, DEFAULT_REWARDS } from '../constants';

interface Props {
  onClose: () => void;
  onSave: (questions: any[], rewards: any[], total: number) => void;
  currentQuestions: any[];
  currentRewards: any[];
}

export const SettingsModal: React.FC<Props> = ({ onClose, onSave, currentQuestions, currentRewards }) => {
  const [activeTab, setActiveTab] = useState<'QUESTIONS' | 'REWARDS'>('QUESTIONS');
  const [questions, setQuestions] = useState([...currentQuestions]);
  const [rewards, setRewards] = useState([...currentRewards]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Helpers to update state
  const addQuestion = () => {
    setQuestions([...questions, { q: "Câu hỏi mới?", options: ["A", "B", "C", "D"], a: 0, pts: 10 }]);
  };
  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };
  const updateQuestion = (idx: number, field: string, value: any) => {
    const newQ = [...questions];
    newQ[idx] = { ...newQ[idx], [field]: value };
    setQuestions(newQ);
  };
  const updateOption = (qIdx: number, oIdx: number, val: string) => {
    const newQ = [...questions];
    newQ[qIdx].options[oIdx] = val;
    setQuestions(newQ);
  };

  const addReward = () => {
    setRewards([...rewards, { amt: 10, msg: "Lời chúc mới" }]);
  };
  const removeReward = (idx: number) => {
    setRewards(rewards.filter((_, i) => i !== idx));
  };
  const updateReward = (idx: number, field: string, value: any) => {
    const newR = [...rewards];
    newR[idx] = { ...newR[idx], [field]: value };
    setRewards(newR);
  };

  const handleSave = () => {
    if (questions.length === 0 || rewards.length === 0) {
      alert("Cần ít nhất 1 câu hỏi và 1 phần thưởng!");
      return;
    }
    onSave(questions, rewards, 30); // Keep 30 fixed for UI layout consistency
    onClose();
  };

  // CSV Processing
  const downloadTemplate = () => {
    const BOM = "\uFEFF"; // UTF-8 BOM
    const csvContent = BOM + "Câu hỏi,Đáp án A,Đáp án B,Đáp án C,Đáp án D,Vị trí đáp án đúng (0-3),Điểm\n" + 
    "15 + 20 = ?,30,35,25,40,1,10\n" + 
    "Thủ đô của Việt Nam là?,Hà Nội,TP.HCM,Đà Nẵng,Cần Thơ,0,20";
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "mau_cau_hoi_lixi.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const text = event.target?.result as string;
        processCSV(text);
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const parseCSVLine = (text: string) => {
    const result = [];
    let cell = '';
    let inQuotes = false;
    
    for(let i=0; i<text.length; i++) {
        const char = text[i];
        if(char === '"') {
            inQuotes = !inQuotes;
        } else if(char === ',' && !inQuotes) {
            result.push(cell.trim());
            cell = '';
        } else {
            cell += char;
        }
    }
    result.push(cell.trim());
    return result.map(c => c.replace(/^"|"$/g, '').replace(/""/g, '"'));
  };

  const processCSV = (text: string) => {
    const lines = text.split('\n');
    const newQuestions = [];
    
    // Skip header (index 0)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const row = parseCSVLine(line);
        
        // Ensure we have enough columns (Question + 4 Options + Answer Index + Points)
        if (row.length >= 7) {
             const points = parseInt(row[6]) || 10;
             const correctIndex = parseInt(row[5]);
             
             // Basic validation
             if (!isNaN(correctIndex) && correctIndex >= 0 && correctIndex <= 3) {
                 newQuestions.push({
                     q: row[0],
                     options: [row[1], row[2], row[3], row[4]],
                     a: correctIndex,
                     pts: points
                 });
             }
        }
    }
    
    if (newQuestions.length > 0) {
        if(window.confirm(`Tìm thấy ${newQuestions.length} câu hỏi hợp lệ.\nNhấn OK để THAY THẾ toàn bộ danh sách cũ.\nNhấn Cancel để THÊM vào danh sách hiện tại.`)) {
             setQuestions(newQuestions);
        } else {
             setQuestions([...questions, ...newQuestions]);
        }
    } else {
        alert("Không đọc được dữ liệu. Vui lòng kiểm tra file CSV theo mẫu.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-tet-cream w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex flex-col border-4 border-tet-gold overflow-hidden">
        
        {/* Header */}
        <div className="bg-tet-red p-4 flex justify-between items-center text-tet-gold border-b-2 border-tet-gold">
          <h2 className="font-bold text-xl uppercase">Cài Đặt Trò Chơi</h2>
          <button onClick={onClose}><X /></button>
        </div>

        {/* Tabs */}
        <div className="flex bg-white border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('QUESTIONS')}
            className={`flex-1 py-3 font-bold ${activeTab === 'QUESTIONS' ? 'bg-yellow-100 text-tet-darkRed border-b-2 border-tet-red' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Ngân hàng Câu hỏi ({questions.length})
          </button>
          <button 
            onClick={() => setActiveTab('REWARDS')}
            className={`flex-1 py-3 font-bold ${activeTab === 'REWARDS' ? 'bg-yellow-100 text-tet-darkRed border-b-2 border-tet-red' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Danh sách Lì xì ({rewards.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          
          {activeTab === 'QUESTIONS' && (
            <div className="space-y-4">
               {/* Import/Export Tools */}
               <div className="flex flex-wrap gap-2 mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                 <button 
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-sm font-semibold text-gray-700"
                 >
                    <Download size={16} /> Tải mẫu Excel/CSV
                 </button>
                 <div className="relative">
                    <input 
                        type="file" 
                        accept=".csv"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 border border-blue-700 rounded shadow-sm hover:bg-blue-700 text-sm font-semibold text-white"
                    >
                        <FileUp size={16} /> Nhập từ file CSV
                    </button>
                 </div>
                 <div className="flex-1 text-xs text-gray-500 flex items-center">
                    *Tải mẫu về, nhập câu hỏi rồi tải lên lại.
                 </div>
               </div>

               {questions.map((q, idx) => (
                 <div key={idx} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                   <div className="flex justify-between mb-2">
                     <span className="font-bold text-gray-400">Câu {idx + 1}</span>
                     <button onClick={() => removeQuestion(idx)} className="text-red-500 hover:text-red-700"><Trash size={18}/></button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2">
                     <div className="md:col-span-9">
                       <label className="text-xs text-gray-500">Nội dung</label>
                       <input 
                         className="w-full border p-2 rounded bg-white" 
                         value={q.q} 
                         onChange={(e) => updateQuestion(idx, 'q', e.target.value)}
                       />
                     </div>
                     <div className="md:col-span-3">
                       <label className="text-xs text-gray-500">Điểm</label>
                       <input 
                         type="number" 
                         className="w-full border p-2 rounded bg-white" 
                         value={q.pts} 
                         onChange={(e) => updateQuestion(idx, 'pts', parseInt(e.target.value) || 0)}
                       />
                     </div>
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                     {q.options.map((opt: string, oIdx: number) => (
                       <div key={oIdx} className="flex flex-col">
                         <div className="flex items-center gap-1">
                           <input 
                             type="radio" 
                             name={`correct-${idx}`} 
                             checked={q.a === oIdx} 
                             onChange={() => updateQuestion(idx, 'a', oIdx)}
                             className="cursor-pointer"
                           />
                           <input 
                             className={`w-full border p-1 text-sm rounded bg-white ${q.a === oIdx ? 'border-green-500 bg-green-50' : ''}`}
                             value={opt}
                             onChange={(e) => updateOption(idx, oIdx, e.target.value)}
                           />
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               ))}
               <button onClick={addQuestion} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-white hover:border-tet-red hover:text-tet-red flex items-center justify-center gap-2">
                 <Plus /> Thêm câu hỏi
               </button>
            </div>
          )}

          {activeTab === 'REWARDS' && (
            <div className="space-y-4">
              {rewards.map((r, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-wrap gap-4 items-end">
                   <div className="flex-1">
                      <label className="text-xs text-gray-500">Lời chúc</label>
                      <input 
                        className="w-full border p-2 rounded bg-white" 
                        value={r.msg} 
                        onChange={(e) => updateReward(idx, 'msg', e.target.value)}
                      />
                   </div>
                   <div className="w-24">
                      <label className="text-xs text-gray-500">Điểm (+)</label>
                      <input 
                        type="number"
                        className="w-full border p-2 rounded bg-white font-bold text-green-600" 
                        value={r.amt} 
                        onChange={(e) => updateReward(idx, 'amt', parseInt(e.target.value) || 0)}
                      />
                   </div>
                   <button onClick={() => removeReward(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash size={18}/></button>
                </div>
              ))}
              <button onClick={addReward} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-white hover:border-tet-red hover:text-tet-red flex items-center justify-center gap-2">
                 <Plus /> Thêm phần thưởng
               </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Hủy</button>
          <button onClick={handleSave} className="px-6 py-2 bg-tet-red text-white rounded-lg hover:bg-tet-darkRed flex items-center gap-2 shadow-lg">
            <Save size={18} /> Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};