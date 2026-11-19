import axios from 'axios'

const ticketApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
})

export async function getTickets() {
  const { data } = await ticketApi.get('/tickets')
  return data
}

export async function getTicket(id) {
  const { data } = await ticketApi.get(`/tickets/${encodeURIComponent(id)}`)
  return data
}

export async function createTicket(ticket) {
  const { data } = await ticketApi.post('/tickets', ticket)
  return data
}

export async function updateTicket(id, ticket) {
  const { data } = await ticketApi.patch(`/tickets/${encodeURIComponent(id)}`, ticket)
  return data
}

export async function deleteTicket(id) {
  await ticketApi.delete(`/tickets/${encodeURIComponent(id)}`)
}
