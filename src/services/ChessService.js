export class ChessService {
  constructor() {
    this.board = this.initializeBoard()
    this.history = []
  }

  initializeBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(null))
    
    // Pièces noires (rangée 0 et 1)
    const blackPieces = ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜']
    blackPieces.forEach((piece, i) => {
      board[0][i] = { piece, color: 'black' }
    })
    for (let i = 0; i < 8; i++) {
      board[1][i] = { piece: '♟', color: 'black' }
    }
    
    // Pièces blanches (rangée 6 et 7)
    const whitePieces = ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
    whitePieces.forEach((piece, i) => {
      board[7][i] = { piece, color: 'white' }
    })
    for (let i = 0; i < 8; i++) {
      board[6][i] = { piece: '♙', color: 'white' }
    }
    
    return board
  }

  getPiece(row, col) {
    return this.board[row][col]
  }

  movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol]
    if (!piece) return false

    const capturedPiece = this.board[toRow][toCol]
    
    // Enregistrer dans l'historique
    this.history.push({
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
      piece: piece.piece,
      captured: capturedPiece ? capturedPiece.piece : null,
      timestamp: new Date().toLocaleTimeString()
    })

    // Déplacer la pièce (remplace celle occupant l'emplacement)
    this.board[toRow][toCol] = piece
    this.board[fromRow][fromCol] = null
    
    return true
  }

  getHistory() {
    return [...this.history]
  }

  getAllPieces() {
    const pieces = []
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col]) {
          pieces.push({
            row,
            col,
            ...this.board[row][col]
          })
        }
      }
    }
    return pieces
  }

  reset() {
    this.board = this.initializeBoard()
    this.history = []
  }
}