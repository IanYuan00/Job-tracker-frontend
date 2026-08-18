import { useState, useEffect } from 'react';
//import { mockApplications } from './mock/applications.js';
import ApplicationForm from './components/ApplicationForm';
import ApplicationTable from './components/ApplicationTable';
import StatsCard from './components/StatsCard';
import { STATUS_LIST } from './constants/status.js';
import { API_BASE_URL } from './config.js';

function App() {
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetch(`${API_BASE_URL}/applications`)
      .then((res) => res.json())
      .then((data) => setJobs(data))
  }, []);

  const handleAddJob = async (jobData) => {
    const res = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    })
    const newJob = await res.json();
    setJobs([newJob, ...jobs]);
  }

  const handleAddClick = () => {
    setEditing(null)
    setIsModalOpen(!isModalOpen);
  }

  const handleDelete = async (id) => {
    const userConfirmed = window.confirm('Are you sure you want to delete the job application?');
    await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'DELETE',
    })
    if (userConfirmed) {
      setJobs(jobs.filter((job) => job.id != id));
    }
  }

  const handleEdit = (id) => {
    setIsModalOpen(true);
    setEditing(jobs.find((job) => job.id === id));
  }

  const onUpdateJob = async (id, jobData) => {
    const res = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    })
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

  const searchedJob = jobs.filter((job) => {
    const keyword = searchTerm.toLowerCase();
    const matchKeyword = !keyword || job.company.toLowerCase().includes(keyword);
    const matchStatus = !searchStatus || searchStatus === job.status;
    return matchKeyword && matchStatus;
  })

  const handleSortClick = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  }

  const sortedJobs = [...searchedJob].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a.date > b.date ? 1 : -1;
    } else {
      return a.date < b.date ? 1 : -1;
    }
  })

  return (
    <div className='app'>
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
      <ApplicationTable jobs={sortedJobs} onDelete={handleDelete} onEdit={handleEdit} onSortClick={handleSortClick} sortDirection={sortDirection} />
      <p>Click a row to expand notes</p>
      {isModalOpen && (
        <div className='modal-overlay' onClick={() => setIsModalOpen(false)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <ApplicationForm
              onSubmitJob={(jobData) => {
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
