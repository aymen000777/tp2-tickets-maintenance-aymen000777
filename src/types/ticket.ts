export interface Ticket {
  id: string
  titre: string
  description: string
  demandeur: string
  priorite: 'Haute' | 'Moyenne' | 'Basse'
  statut: 'Ouvert' | 'En cours' | 'Résolu' | 'Fermé'
  dateCreation: string
}

export type TicketDraft = Omit<Ticket, 'id'>

export const ticketStatuses: Ticket['statut'][] = ['Ouvert', 'En cours', 'Résolu', 'Fermé']

export const ticketPriorities: Ticket['priorite'][] = ['Basse', 'Moyenne', 'Haute']
