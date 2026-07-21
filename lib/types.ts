export type InvitationTheme = 'rose' | 'wine' | 'peach';
export type InvitationDate = { id: string; label: string; value: string };
export type InvitationActivity = { id: string; title: string; description?: string; icon?: string; imageUrl?: string };
export type Invitation = { id: string; slug: string; recipientName: string; senderName: string; introText: string; questionText: string; acceptedText: string; finalText: string; availableDates: InvitationDate[]; activities: InvitationActivity[]; contactUrl?: string | null; theme: InvitationTheme; allowDecline: boolean; multiSelectActivities: boolean; createdAt: Date };
export type InvitationStep = 'closed'|'question'|'acceptedReaction'|'date'|'activity'|'summary'|'success'|'declined';
export type DraftState = { step: InvitationStep; answer?: 'accepted'|'declined'; selectedDate?: string; customDate?: string; selectedActivities: string[]; comment?: string };
export type DashboardStatus = 'ещё не открыто'|'открыто'|'принято'|'отклонено'|'дата выбрана'|'приглашение подтверждено';
