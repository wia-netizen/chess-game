import { describe, it, expect, beforeEach } from 'vitest'
import { ChessService } from '../services/ChessService'

describe('ChessService', () => {
  let service

  beforeEach(() => {
    service = new ChessService()
  })

  describe('Initialisation du plateau', () => {
    it('doit créer un plateau 8x8', () => {
      expect(service.board).toHaveLength(8)
      expect(service.board[0]).toHaveLength(8)
    })

    it('doit placer les pièces noires en haut (rangées 0 et 1)', () => {
      // Vérifier la rangée 0 (pièces majeures noires)
      expect(service.getPiece(0, 0)).toEqual({ piece: '♜', color: 'black' })
      expect(service.getPiece(0, 1)).toEqual({ piece: '♞', color: 'black' })
      expect(service.getPiece(0, 4)).toEqual({ piece: '♚', color: 'black' })
      
      // Vérifier la rangée 1 (pions noirs)
      expect(service.getPiece(1, 0)).toEqual({ piece: '♟', color: 'black' })
      expect(service.getPiece(1, 4)).toEqual({ piece: '♟', color: 'black' })
    })

    it('doit placer les pièces blanches en bas (rangées 6 et 7)', () => {
      // Vérifier la rangée 7 (pièces majeures blanches)
      expect(service.getPiece(7, 0)).toEqual({ piece: '♖', color: 'white' })
      expect(service.getPiece(7, 1)).toEqual({ piece: '♘', color: 'white' })
      expect(service.getPiece(7, 4)).toEqual({ piece: '♔', color: 'white' })
      
      // Vérifier la rangée 6 (pions blancs)
      expect(service.getPiece(6, 0)).toEqual({ piece: '♙', color: 'white' })
      expect(service.getPiece(6, 4)).toEqual({ piece: '♙', color: 'white' })
    })

    it('doit laisser les cases du milieu vides', () => {
      expect(service.getPiece(2, 0)).toBeNull()
      expect(service.getPiece(3, 4)).toBeNull()
      expect(service.getPiece(4, 7)).toBeNull()
      expect(service.getPiece(5, 3)).toBeNull()
    })

    it('doit initialiser un historique vide', () => {
      expect(service.history).toEqual([])
      expect(service.getHistory()).toHaveLength(0)
    })
  })

  describe('getPiece()', () => {
    it('doit retourner une pièce existante', () => {
      const piece = service.getPiece(0, 0)
      expect(piece).toEqual({ piece: '♜', color: 'black' })
    })

    it('doit retourner null pour une case vide', () => {
      const piece = service.getPiece(4, 4)
      expect(piece).toBeNull()
    })
  })

  describe('movePiece()', () => {
    it('doit déplacer une pièce vers une case vide', () => {
      // Déplacer le pion blanc de e2 (6,4) vers e4 (4,4)
      const result = service.movePiece(6, 4, 4, 4)
      
      expect(result).toBe(true)
      expect(service.getPiece(6, 4)).toBeNull()
      expect(service.getPiece(4, 4)).toEqual({ piece: '♙', color: 'white' })
    })

    it('doit remplacer une pièce sur une case occupée (capture)', () => {
      // Placer manuellement une pièce noire sur e4
      service.board[4][4] = { piece: '♟', color: 'black' }
      
      // Déplacer le pion blanc de e2 (6,4) vers e4 (4,4) pour capturer
      const result = service.movePiece(6, 4, 4, 4)
      
      expect(result).toBe(true)
      expect(service.getPiece(6, 4)).toBeNull()
      expect(service.getPiece(4, 4)).toEqual({ piece: '♙', color: 'white' })
    })

    it('ne doit pas déplacer depuis une case vide', () => {
      const result = service.movePiece(4, 4, 5, 5)
      expect(result).toBe(false)
    })

    it('doit mettre à jour l\'historique après un déplacement', () => {
      service.movePiece(6, 4, 4, 4)
      
      const history = service.getHistory()
      expect(history).toHaveLength(1)
      expect(history[0]).toMatchObject({
        from: { row: 6, col: 4 },
        to: { row: 4, col: 4 },
        piece: '♙',
        captured: null
      })
      expect(history[0].timestamp).toBeDefined()
    })

    it('doit enregistrer la capture dans l\'historique', () => {
      // Placer une pièce noire à capturer
      service.board[4][4] = { piece: '♟', color: 'black' }
      
      service.movePiece(6, 4, 4, 4)
      
      const history = service.getHistory()
      expect(history[0].captured).toBe('♟')
    })

    it('doit enregistrer plusieurs coups dans l\'historique', () => {
      service.movePiece(6, 4, 4, 4) // Pion blanc e2-e4
      service.movePiece(1, 4, 3, 4) // Pion noir e7-e5
      service.movePiece(7, 1, 5, 2) // Cavalier blanc b1-c3
      
      const history = service.getHistory()
      expect(history).toHaveLength(3)
    })
  })

  describe('getHistory()', () => {
    it('doit retourner une copie de l\'historique', () => {
      service.movePiece(6, 4, 4, 4)
      
      const history1 = service.getHistory()
      const history2 = service.getHistory()
      
      expect(history1).toEqual(history2)
      expect(history1).not.toBe(history2) // Vérifier que c'est une copie
    })

    it('ne doit pas modifier l\'historique original si on modifie la copie', () => {
      service.movePiece(6, 4, 4, 4)
      
      const history = service.getHistory()
      history.push({ fake: 'move' })
      
      expect(service.getHistory()).toHaveLength(1)
    })
  })

  describe('getAllPieces()', () => {
    it('doit retourner toutes les pièces au début du jeu', () => {
      const pieces = service.getAllPieces()
      expect(pieces).toHaveLength(32) // 16 blanches + 16 noires
    })

    it('doit retourner les bonnes positions des pièces', () => {
      const pieces = service.getAllPieces()
      const whiteKing = pieces.find(p => p.piece === '♔')
      
      expect(whiteKing).toMatchObject({
        row: 7,
        col: 4,
        piece: '♔',
        color: 'white'
      })
    })

    it('doit mettre à jour la liste après un déplacement', () => {
      service.movePiece(6, 4, 4, 4)
      
      const pieces = service.getAllPieces()
      const movedPawn = pieces.find(p => p.row === 4 && p.col === 4)
      
      expect(movedPawn).toMatchObject({
        piece: '♙',
        color: 'white'
      })
    })

    it('doit réduire le nombre de pièces après une capture', () => {
      // Forcer une capture
      service.board[4][4] = { piece: '♟', color: 'black' }
      service.movePiece(6, 4, 4, 4)
      
      const pieces = service.getAllPieces()
      expect(pieces).toHaveLength(32) // Toujours 32 car on a ajouté manuellement
    })
  })

  describe('reset()', () => {
    it('doit réinitialiser le plateau à l\'état initial', () => {
      // Faire quelques déplacements
      service.movePiece(6, 4, 4, 4)
      service.movePiece(1, 4, 3, 4)
      
      service.reset()
      
      // Vérifier que les pièces sont revenues à leur position initiale
      expect(service.getPiece(6, 4)).toEqual({ piece: '♙', color: 'white' })
      expect(service.getPiece(1, 4)).toEqual({ piece: '♟', color: 'black' })
      expect(service.getPiece(4, 4)).toBeNull()
    })

    it('doit vider l\'historique', () => {
      service.movePiece(6, 4, 4, 4)
      service.movePiece(1, 4, 3, 4)
      
      service.reset()
      
      expect(service.getHistory()).toHaveLength(0)
    })

    it('doit restaurer toutes les 32 pièces', () => {
      // Capturer quelques pièces
      service.board[4][4] = { piece: '♟', color: 'black' }
      service.movePiece(6, 4, 4, 4)
      
      service.reset()
      
      const pieces = service.getAllPieces()
      expect(pieces).toHaveLength(32)
    })
  })

  describe('Scénarios de jeu complets', () => {
    it('doit gérer une séquence de coups valide', () => {
      // Ouverture italienne simplifiée
      service.movePiece(6, 4, 4, 4) // e4
      service.movePiece(1, 4, 3, 4) // e5
      service.movePiece(7, 6, 5, 5) // Nf3
      service.movePiece(0, 1, 2, 2) // Nc6
      
      expect(service.getHistory()).toHaveLength(4)
      expect(service.getPiece(4, 4)).toEqual({ piece: '♙', color: 'white' })
      expect(service.getPiece(3, 4)).toEqual({ piece: '♟', color: 'black' })
    })

    it('doit permettre des déplacements non conventionnels (pas de règles)', () => {
      // Déplacer le roi blanc directement en avant (normalement impossible)
      service.movePiece(7, 4, 5, 4)
      
      expect(service.getPiece(5, 4)).toEqual({ piece: '♔', color: 'white' })
      expect(service.getPiece(7, 4)).toBeNull()
    })
  })
})