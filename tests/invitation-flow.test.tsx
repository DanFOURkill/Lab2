import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { InvitationShell } from '@/components/invitation/InvitationShell';
import { demoInvitation } from '@/lib/defaults';
const invitation = { id:'1', createdAt:new Date(), ...demoInvitation };
beforeEach(()=>{sessionStorage.clear();vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok:true,json:async()=>({ok:true})}))});
describe('InvitationShell',()=>{
 it('проходит основной сценарий и отправляет результат', async()=>{render(<InvitationShell invitation={invitation}/>);fireEvent.click(screen.getByText('Открыть'));fireEvent.click(screen.getByText('Да'));await waitFor(()=>expect(screen.getByText('Продолжить')).not.toBeDisabled());fireEvent.click(screen.getByText('Продолжить'));fireEvent.click(screen.getByText('Пятница, 24 июля'));fireEvent.click(screen.getByText('Продолжить'));fireEvent.click(screen.getByText('Прогулка'));fireEvent.click(screen.getByText('Продолжить'));fireEvent.click(screen.getByText('Подтвердить'));await screen.findByText(/официально/);expect(fetch).toHaveBeenCalled();});
 it('поддерживает отказ после нескольких попыток',()=>{render(<InvitationShell invitation={invitation}/>);fireEvent.click(screen.getByText('Открыть'));const no=screen.getByText('Нет');fireEvent.click(no);fireEvent.click(screen.getByText('Точно нет?'));fireEvent.click(screen.getByText('Подумай ещё'));fireEvent.click(screen.getByText('Может всё-таки да?'));fireEvent.click(screen.getByText('Последний шанс'));expect(screen.getByText('Ничего страшного.')).toBeInTheDocument();});
 it('восстанавливает состояние после обновления',()=>{const {unmount}=render(<InvitationShell invitation={invitation}/>);fireEvent.click(screen.getByText('Открыть'));unmount();render(<InvitationShell invitation={invitation}/>);expect(screen.getByText('Да')).toBeInTheDocument();});
});
