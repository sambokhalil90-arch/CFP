import { useMemo, useState } from 'react'
import { differenceInCalendarDays } from 'date-fns'
import { sampleQuestions } from './sampleQuestions'

const examDate = new Date('2026-11-10')
const mistakeTypes = ['Knowledge gap','Application gap','Wording trap','Calculation error','Rushed answer','Second guessed']

export default function App() {
  const [screen, setScreen] = useState('dashboard')
  const [topic, setTopic] = useState('General Principles')
  const [count, setCount] = useState(5)
  const [mode, setMode] = useState('Learn')
  const [idx, setIdx] = useState(0)
  const [drill, setDrill] = useState([])
  const [attempts, setAttempts] = useState([])
  const [selected, setSelected] = useState('')
  const [confidence, setConfidence] = useState('Medium')

  const topics = [...new Set(sampleQuestions.map(q => q.topic))]
  const daysLeft = differenceInCalendarDays(examDate, new Date())
  const weakest = useMemo(() => attempts.find(a => !a.is_correct)?.topic || 'Insurance', [attempts])
  const commonMistake = useMemo(() => attempts.filter(a => !a.is_correct).at(-1)?.mistake_type || 'Wording trap', [attempts])

  const startDrill = () => {
    const pool = sampleQuestions.filter(q => q.topic === topic)
    setDrill(pool.slice(0, count))
    setIdx(0)
    setSelected('')
    setScreen('question')
  }

  const question = drill[idx]

  const submit = () => {
    const isCorrect = selected === question.correct_answer
    setAttempts(prev => [...prev, { ...question, selected_answer: selected, is_correct: isCorrect, confidence, mistake_type: isCorrect ? null : 'Knowledge gap' }])
    setScreen('review')
  }

  if (screen === 'dashboard') return <main className='app'><h1>CFP Performance Coach</h1><p>{daysLeft} days until CFP exam (Nov 10, 2026)</p><Card label='Weakest topic' value={weakest} /><Card label='Most common mistake type' value={commonMistake} /><Card label='Tonight\'s 20-minute drill' value={`10 ${weakest} questions in ${mode} mode`} /><button onClick={() => setScreen('setup')}>Start Drill</button><button onClick={() => setScreen('weak')}>Weak Area Dashboard</button><button onClick={() => setScreen('log')}>Mistake Log</button></main>

  if (screen === 'setup') return <main className='app'><h2>Drill Setup</h2><label>Topic<select value={topic} onChange={e => setTopic(e.target.value)}>{topics.map(t => <option key={t}>{t}</option>)}</select></label><label>Question count<select value={count} onChange={e => setCount(Number(e.target.value))}><option>5</option><option>10</option><option>20</option></select></label><label>Mode<select value={mode} onChange={e => setMode(e.target.value)}><option>Learn</option><option>Exam</option><option>Review Mistakes</option></select></label><button onClick={startDrill}>Begin</button></main>

  if (screen === 'question' && question) return <main className='app'><h2>Question {idx + 1} of {drill.length}</h2><p>{question.question_text}</p>{Object.entries(question.choices).map(([k,v]) => <button key={k} className={selected===k?'choice active':'choice'} onClick={() => setSelected(k)}>{k}. {v}</button>)}<label>Confidence<select value={confidence} onChange={e => setConfidence(e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label><button disabled={!selected} onClick={submit}>Submit</button></main>

  if (screen === 'review') {
    const last = attempts.at(-1)
    return <main className='app'><h2>Review</h2><p><strong>Correct answer:</strong> {last.correct_answer}</p><p><strong>Why correct:</strong> {last.explanation}</p><p><strong>Why wrong answers are wrong:</strong> {Object.entries(last.wrong_answer_explanations).map(([k,v]) => `${k}: ${v}`).join(' | ')}</p><p><strong>What CFP is testing:</strong> Core competency in {last.subtopic}.</p><p><strong>Trap:</strong> {last.exam_trap}</p><p><strong>Memory takeaway:</strong> {last.memory_takeaway}</p>{!last.is_correct && <label>Mistake Tag<select onChange={e => setAttempts(a => [...a.slice(0,-1), {...last, mistake_type:e.target.value}])}>{mistakeTypes.map(m => <option key={m}>{m}</option>)}</select></label>}<button onClick={() => { if (idx+1 < drill.length) { setIdx(idx+1); setSelected(''); setScreen('question') } else setScreen('dashboard')}}>{idx+1 < drill.length ? 'Next Question' : 'Finish Drill'}</button></main>
  }

  if (screen === 'log') return <main className='app'><h2>Mistake Log</h2>{attempts.filter(a => !a.is_correct).map((a,i) => <div key={i} className='card'><p>{a.topic} / {a.subtopic}</p><p>{a.question_text}</p><p>Mistake: {a.mistake_type || 'Unlabeled'}</p></div>)}<button onClick={()=>setScreen('dashboard')}>Back</button></main>

  return <main className='app'><h2>Weak Area Dashboard</h2><Card label='Accuracy by topic' value={`${Math.round((attempts.filter(a => a.is_correct).length / (attempts.length || 1)) * 100)}% overall`} /><Card label='Most common mistake type' value={commonMistake} /><Card label='High-confidence wrong answers' value={`${attempts.filter(a => !a.is_correct && a.confidence === 'High').length}`} /><Card label='Recommended next drill' value={`5-question ${weakest} mixed-subtopic drill`} /><button onClick={()=>setScreen('dashboard')}>Back</button></main>
}

function Card({ label, value }) { return <div className='card'><p className='label'>{label}</p><p className='value'>{value}</p></div> }
