const API_BASE_URL = 'http://localhost:3001/api'

export async function fetchProjects() {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`)
    if (!response.ok) {
      throw new Error('Failed to fetch projects')
    }
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export async function fetchBlogPosts() {
  try {
    const response = await fetch(`${API_BASE_URL}/blog`)
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts')
    }
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export async function fetchLearning() {
  try {
    const response = await fetch(`${API_BASE_URL}/learning`)
    if (!response.ok) {
      throw new Error('Failed to fetch learning items')
    }
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching learning items:', error)
    return []
  }
}

export async function fetchWorkHistory() {
  try {
    const response = await fetch(`${API_BASE_URL}/work-history`)
    if (!response.ok) {
      throw new Error('Failed to fetch work history')
    }
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching work history:', error)
    return []
  }
}

export async function fetchEducation() {
  try {
    const response = await fetch(`${API_BASE_URL}/work-history/education`)
    if (!response.ok) {
      throw new Error('Failed to fetch education')
    }
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching education:', error)
    return []
  }
}

export async function fetchCertifications() {
  try {
    const response = await fetch(`${API_BASE_URL}/certifications`)
    if (!response.ok) {
      throw new Error('Failed to fetch certifications')
    }
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching certifications:', error)
    return []
  }
}
