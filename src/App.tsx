import { useState, useEffect } from 'react';
//import { mockApplications } from './mock/applications.js';
import ApplicationForm from './components/ApplicationForm';
import ApplicationList from './components/ApplicationList.jsx';
import StatsCard from './components/StatsCard';
import { STATUS_LIST } from './constants/status.js';
import { API_BASE_URL } from './config.js';

interface Job {
  id: string
  company: string
  position: string
  status: string
  date: string
  notes?: string
}

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandAll, setExpandAll] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/applications`)
      .then((res) => res.json())
      .then((data) => setJobs(data))
  }, []);

  const handleAddJob = async (jobData: Omit<Job, 'id'>) => {
    const res = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    })

    if (!res.ok) {
      const errorData = await res.json();
      alert(errorData.error || 'Something went wrong...');
      return;
    }
    const newJob = await res.json();
    setJobs([newJob, ...jobs]);
  }

  const handleAddClick = () => {
    setEditing(null)
    setIsModalOpen(!isModalOpen);
  }

  const handleDelete = async (id: string) => {
    const userConfirmed = window.confirm('Are you sure you want to delete the job application?');
    if (!userConfirmed) {
      return;
    }

    const res = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      const errorData = await res.json();
      alert(errorData.error || 'Something went wrong...');
      return;
    }
    setJobs(jobs.filter((job) => job.id != id));

  }

  const handleEdit = (id: string) => {
    setIsModalOpen(true);
    setEditing(jobs.find((job) => job.id === id) ?? null);
  }

  const onUpdateJob = async (id: string, jobData: Partial<Job>) => {
    const res = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    })

    if (!res.ok) {
      const errorData = await res.json();
      alert(errorData.error || 'Something went wrong...');
      return;
    }
    const updatedJob = await res.json();
    setJobs(jobs.map((job) => {
      if (job.id === id) {
        return { ...updatedJob };
      } else {
        return job;
      }
    }))
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditing(null);
  }

  const searchedJob = jobs.filter((job: Job) => {
    const keyword = searchTerm.toLowerCase();
    const matchKeyword = !keyword || job.company.toLowerCase().includes(keyword);
    const matchStatus = !searchStatus || searchStatus === job.status;
    return matchKeyword && matchStatus;
  })

  const sortedJobs = [...searchedJob].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a.date > b.date ? 1 : -1;
    } else {
      return a.date < b.date ? 1 : -1;
    }
  });

  const handleExpandAll = () => {
    setExpandAll({ action: 'expand', key: Date.now() });
  }

  const handleCollapseAll = () => {
    setExpandAll({ action: 'collpase', Key: Date.now() });
  }

  return (
    <div className='app'>
      <div className='sticky-header'>
        <div className='header'>
          <h1>Job Tracker</h1>
          <button onClick={handleAddClick}>+ Add new application</button>
        </div>

        <StatsCard jobs={jobs} />

        <div className='search'>
          <input
            type='text'
            placeholder='Search company name...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}>
            <option value=''>Searche by status</option>
            {STATUS_LIST.map((s) => (
              <option key={s.value} value={s.value}>
                {s.value}
              </option>
            ))}
          </select>
        </div>

        <div className='sortbar'>
          <div className='sortbar-left'>
            <span>Sort by</span>
            <select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}>
              <option value='desc'>Date (newest first)</option>
              <option value='asc'>Date (oldest first)</option>
            </select>
          </div>
          <div className='sortbar-right'>
            <button onClick={handleExpandAll}>Expand all</button>
            <button onClick={handleCollapseAll}>Collapse all</button>
          </div>
        </div>
      </div>

      <ApplicationList jobs={sortedJobs} onDelete={handleDelete} onEdit={handleEdit} expandAll={expandAll} />
      <p>Click a row to expand notes</p>

      {isModalOpen && (
        <div className='modal-overlay' onClick={() => setIsModalOpen(false)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <ApplicationForm
              onSubmitJob={(jobData: Job) => {
                if (editing) {
                  onUpdateJob(editing.id, jobData);
                } else {
                  handleAddJob(jobData);
                }
                setIsModalOpen(false);
                setEditing(null);
              }}
              editJob={editing}
              onCancelClick={handleCancel} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
