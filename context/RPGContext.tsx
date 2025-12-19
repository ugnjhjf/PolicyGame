'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { RPGState, INITIAL_RPG_STATE, Clue, Concept, Item } from '../types/rpg'

interface RPGContextType {
  state: RPGState
  addClue: (clue: Clue) => void
  addConcept: (concept: Concept) => void
  addItem: (item: Item) => void
  setFlag: (key: string, value: boolean) => void
  completeEvent: (eventId: string) => void
  resetState: () => void
}

const RPGContext = createContext<RPGContextType | undefined>(undefined)

export function RPGProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RPGState>(INITIAL_RPG_STATE)

  // Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rpg_state')
    if (saved) {
      try {
        setState(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load save', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('rpg_state', JSON.stringify(state))
  }, [state])

  const addClue = (clue: Clue) => {
    setState(prev => {
      if (prev.player.journal.some(c => c.id === clue.id)) return prev
      return {
        ...prev,
        player: { ...prev.player, journal: [...prev.player.journal, clue] }
      }
    })
  }

  const addConcept = (concept: Concept) => {
    setState(prev => {
      if (prev.player.encyclopedia.some(c => c.id === concept.id)) return prev
      return {
        ...prev,
        player: { ...prev.player, encyclopedia: [...prev.player.encyclopedia, concept] }
      }
    })
  }

  const addItem = (item: Item) => {
     setState(prev => {
      if (prev.player.inventory.some(i => i.id === item.id)) return prev
      return {
        ...prev,
        player: { ...prev.player, inventory: [...prev.player.inventory, item] }
      }
    })
  }

  const setFlag = (key: string, value: boolean) => {
    setState(prev => ({
      ...prev,
      flags: { ...prev.flags, [key]: value }
    }))
  }

  const completeEvent = (eventId: string) => {
    setState(prev => ({
      ...prev,
      map: {
        ...prev.map,
        activeEvents: prev.map.activeEvents.map(e => 
          e.id === eventId ? { ...e, isCompleted: true } : e
        )
      }
    }))
  }

  const resetState = () => {
    setState(INITIAL_RPG_STATE)
  }

  return (
    <RPGContext.Provider value={{
      state,
      addClue,
      addConcept,
      addItem,
      setFlag,
      completeEvent,
      resetState
    }}>
      {children}
    </RPGContext.Provider>
  )
}

export function useRPG() {
  const context = useContext(RPGContext)
  if (context === undefined) {
    throw new Error('useRPG must be used within a RPGProvider')
  }
  return context
}
