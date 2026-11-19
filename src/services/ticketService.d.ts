import type { Ticket, TicketDraft } from '../types/ticket'

export function getTickets(): Promise<Ticket[]>
export function getTicket(id: string): Promise<Ticket>
export function createTicket(data: TicketDraft): Promise<Ticket>
export function updateTicket(id: string, data: Partial<TicketDraft>): Promise<Ticket>
export function deleteTicket(id: string): Promise<void>
