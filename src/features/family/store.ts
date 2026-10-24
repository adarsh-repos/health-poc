import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createId } from '@/lib/id';
import { persistOptions } from '@/lib/persist';
import type { FamilyMember, HealthProfile, MemberIdentity, Relation } from './types';

interface FamilyState {
  members: FamilyMember[];
  activeMemberId: string | null;
  addMember: (input: {
    name: string;
    relation: Relation;
    birthYear?: number;
    health?: HealthProfile;
    identity?: MemberIdentity;
  }) => FamilyMember;
  setActiveMember: (id: string) => void;
  updateMember: (id: string, patch: Partial<Pick<FamilyMember, 'name' | 'birthYear'>>) => void;
  updateHealth: (id: string, patch: Partial<HealthProfile>) => void;
  reset: () => void;
}

export const useFamily = create<FamilyState>()(
  persist(
    (set, get) => ({
      members: [],
      activeMemberId: null,

      addMember: (input) => {
        const member: FamilyMember = {
          ...input,
          name: input.name.trim(),
          id: createId('mem'),
          createdAt: new Date().toISOString(),
        };
        set({
          members: [...get().members, member],
          activeMemberId: get().activeMemberId ?? member.id,
        });
        return member;
      },

      setActiveMember: (id) => set({ activeMemberId: id }),

      updateMember: (id, patch) =>
        set({ members: get().members.map((m) => (m.id === id ? { ...m, ...patch } : m)) }),

      updateHealth: (id, patch) =>
        set({
          members: get().members.map((m) => (m.id === id ? { ...m, health: { ...m.health, ...patch } } : m)),
        }),

      reset: () => set({ members: [], activeMemberId: null }),
    }),
    persistOptions<FamilyState>('family', {
      partialize: (s) => ({ members: s.members, activeMemberId: s.activeMemberId }),
    }),
  ),
);

export function useActiveMember() {
  return useFamily((s) => s.members.find((m) => m.id === s.activeMemberId) ?? s.members[0] ?? null);
}

export function useMember(id: string | null | undefined) {
  return useFamily((s) => s.members.find((m) => m.id === id) ?? null);
}

/** "Your records" vs "Saraswati's records" */
export function possessive(member: { name: string; relation: Relation } | null) {
  if (!member) return 'Records';
  if (member.relation === 'self') return 'Your records';
  return `${member.name.split(' ')[0]}'s records`;
}
