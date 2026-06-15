import { useState, useEffect } from 'react'
import { api } from '../api/client'

export function useBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api.get('/api/blogs').then((d) => setBlogs(d.blogs || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])
  return { blogs, loading }
}

export function useServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api.get('/api/services').then((d) => setServices(d.services || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])
  return { services, loading }
}

export function useProjects({ featured } = {}) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const path = featured ? '/api/projects?featured=true' : '/api/projects'
    api.get(path).then((d) => setProjects(d.projects || [])).catch(() => {}).finally(() => setLoading(false))
  }, [featured])
  return { projects, loading }
}

export function useCaseStudies({ featured } = {}) {
  const [caseStudies, setCaseStudies] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const path = featured ? '/api/case-studies?featured=true' : '/api/case-studies'
    api.get(path).then((d) => setCaseStudies(d.caseStudies || [])).catch(() => {}).finally(() => setLoading(false))
  }, [featured])
  return { caseStudies, loading }
}

export function useJobs({ featured, q } = {}) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let path = '/api/jobs'
    const params = []
    if (featured) params.push('featured=true')
    if (q) params.push('q=' + encodeURIComponent(q))
    if (params.length) path += '?' + params.join('&')
    api.get(path).then((d) => setJobs(d.jobs || [])).catch(() => {}).finally(() => setLoading(false))
  }, [featured, q])
  return { jobs, loading }
}
