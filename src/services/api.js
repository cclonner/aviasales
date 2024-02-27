const BASE_URL = 'https://aviasales-test-api.kata.academy'

export const getSearchId = async () => {
  try {
    const response = await fetch(`${BASE_URL}/search`)
    const data = await response.json()
    return data.searchId
  } catch (error) {
    throw new Error('Failed to fetch searchId')
  }
}

export const getTickets = async (searchId) => {
  try {
    const response = await fetch(`${BASE_URL}/tickets?searchId=${searchId}`)
    const data = await response.json()
    return data
  } catch (error) {
    throw new Error('Failed to fetch tickets')
  }
}
