<template>
  <div class="chess-container">
    <h1>Jeu d'Échecs</h1>
    <p class="subtitle">Déplacez librement les pièces sur l'échiquier</p>

    <div class="game-layout">
      <!-- Échiquier -->
      <div class="board-container">
        <div class="column-labels">
          <div v-for="col in 8" :key="col" class="label">
            {{ String.fromCharCode(64 + col) }}
          </div>
        </div>

        <div class="board-with-numbers">
          <div class="row-labels">
            <div v-for="row in 8" :key="row" class="label">
              {{ 9 - row }}
            </div>
          </div>

          <div class="board">
            <div
              v-for="(row, rowIndex) in board"
              :key="rowIndex"
              class="row"
            >
              <div
                v-for="(cell, colIndex) in row"
                :key="colIndex"
                class="cell"
                :class="{
                  light: (rowIndex + colIndex) % 2 === 0,
                  dark: (rowIndex + colIndex) % 2 !== 0,
                  selected: isSelected(rowIndex, colIndex)
                }"
                @click="handleCellClick(rowIndex, colIndex)"
              >
                <span v-if="cell" :class="['piece', cell.color]">
                  {{ cell.piece }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button @click="resetGame" class="reset-btn">
          Réinitialiser
        </button>
      </div>

      <!-- Historique -->
      <div class="history-container">
        <h2>Historique des coups</h2>
        <div class="history-list">
          <div v-if="history.length === 0" class="no-history">
            Aucun coup joué
          </div>
          <div
            v-else
            v-for="(move, index) in history"
            :key="index"
            class="history-item"
          >
            <div class="move-header">
              <span class="move-number">Coup {{ index + 1 }}</span>
              <span class="move-time">{{ move.timestamp }}</span>
            </div>
            <div class="move-details">
              {{ move.piece }} : 
              {{ getColumnLabel(move.from.col) }}{{ 8 - move.from.row }} → 
              {{ getColumnLabel(move.to.col) }}{{ 8 - move.to.row }}
              <span v-if="move.captured" class="captured">
                (capture {{ move.captured }})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ChessService } from '../services/ChessService'

export default {
  name: 'ChessBoard',
  data() {
    return {
      service: new ChessService(),
      board: [],
      selectedCell: null,
      history: []
    }
  },
  mounted() {
    this.board = this.service.board
  },
  methods: {
    handleCellClick(row, col) {
      if (this.selectedCell === null) {
        // Sélectionner une pièce
        if (this.service.getPiece(row, col)) {
          this.selectedCell = { row, col }
        }
      } else {
        // Déplacer la pièce
        if (this.selectedCell.row === row && this.selectedCell.col === col) {
          this.selectedCell = null
        } else {
          this.service.movePiece(this.selectedCell.row, this.selectedCell.col, row, col)
          this.board = [...this.service.board]
          this.history = this.service.getHistory()
          this.selectedCell = null
        }
      }
    },
    isSelected(row, col) {
      return this.selectedCell?.row === row && this.selectedCell?.col === col
    },
    getColumnLabel(col) {
      return String.fromCharCode(65 + col)
    },
    resetGame() {
      this.service.reset()
      this.board = [...this.service.board]
      this.history = []
      this.selectedCell = null
    }
  }
}
</script>

<style scoped>
.chess-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 2rem;
  color: white;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #94a3b8;
  margin-bottom: 2rem;
}

.game-layout {
  display: flex;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  justify-content: center;
}

.board-container {
  background: #1e293b;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.column-labels {
  display: flex;
  margin-left: 2rem;
  margin-bottom: 0.25rem;
}

.column-labels .label {
  width: 60px;
  text-align: center;
  font-weight: bold;
  color: #94a3b8;
  font-size: 0.9rem;
}

.board-with-numbers {
  display: flex;
}

.row-labels {
  display: flex;
  flex-direction: column;
  margin-right: 0.25rem;
}

.row-labels .label {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #94a3b8;
  font-size: 0.9rem;
  width: 2rem;
}

.board {
  display: inline-block;
  border: 3px solid #475569;
}

.row {
  display: flex;
}

.cell {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.cell.light {
  background-color: #f0d9b5;
}

.cell.dark {
  background-color: #b58863;
}

.cell.selected {
  box-shadow: inset 0 0 0 4px #3b82f6;
}

.cell:hover {
  opacity: 0.8;
}

.piece {
  font-size: 2.5rem;
  user-select: none;
}

.piece.white {
  color: white;
  filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5));
}

.piece.black {
  color: #000;
}

.reset-btn {
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.reset-btn:hover {
  background: #2563eb;
}

.history-container {
  background: #1e293b;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  width: 300px;
}

.history-container h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #60a5fa;
}

.history-list {
  max-height: 400px;
  overflow-y: auto;
}

.no-history {
  color: #64748b;
  font-style: italic;
}

.history-item {
  background: #334155;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

.move-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.move-number {
  font-weight: bold;
}

.move-time {
  font-size: 0.75rem;
  color: #94a3b8;
}

.move-details {
  font-size: 0.9rem;
  color: #cbd5e1;
}

.captured {
  color: #f87171;
  margin-left: 0.5rem;
}
</style>