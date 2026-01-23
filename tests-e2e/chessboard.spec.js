import { test, expect } from '@playwright/test'

test.describe('ChessBoard Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Attendre que l'échiquier soit chargé
    await page.waitForSelector('.board', { timeout: 5000 })
  })

  test('doit afficher le titre de l\'application', async ({ page }) => {
    const title = await page.locator('h1').textContent()
    expect(title).toBe('Jeu d\'Échecs')
  })

  test('doit afficher le sous-titre', async ({ page }) => {
    const subtitle = await page.locator('.subtitle').textContent()
    expect(subtitle).toContain('Déplacez librement les pièces')
  })

  test('doit afficher un plateau 8x8', async ({ page }) => {
    const rows = await page.locator('.board .row').count()
    expect(rows).toBe(8)
    
    const firstRowCells = await page.locator('.board .row').first().locator('.cell').count()
    expect(firstRowCells).toBe(8)
  })

  test('doit afficher les labels des colonnes (A-H)', async ({ page }) => {
    const columnLabels = await page.locator('.column-labels .label').allTextContents()
    expect(columnLabels).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'])
  })

  test('doit afficher les labels des rangées (1-8)', async ({ page }) => {
    const rowLabels = await page.locator('.row-labels .label').allTextContents()
    expect(rowLabels).toEqual(['8', '7', '6', '5', '4', '3', '2', '1'])
  })

  test('doit afficher 32 pièces au début du jeu', async ({ page }) => {
    const pieces = await page.locator('.piece').count()
    expect(pieces).toBe(32)
  })

  test('doit afficher les pièces blanches sur les rangées 1 et 2', async ({ page }) => {
    // Vérifier les pions blancs (rangée 2, index 6)
    const whitePawns = await page.locator('.board .row').nth(6).locator('.piece.white').count()
    expect(whitePawns).toBe(8)
    
    // Vérifier les pièces majeures blanches (rangée 1, index 7)
    const whitePieces = await page.locator('.board .row').nth(7).locator('.piece.white').count()
    expect(whitePieces).toBe(8)
  })

  test('doit afficher les pièces noires sur les rangées 7 et 8', async ({ page }) => {
    // Vérifier les pions noirs (rangée 7, index 1)
    const blackPawns = await page.locator('.board .row').nth(1).locator('.piece.black').count()
    expect(blackPawns).toBe(8)
    
    // Vérifier les pièces majeures noires (rangée 8, index 0)
    const blackPieces = await page.locator('.board .row').nth(0).locator('.piece.black').count()
    expect(blackPieces).toBe(8)
  })

  test('doit avoir des cases alternées claires et foncées', async ({ page }) => {
    const firstCell = await page.locator('.board .row').first().locator('.cell').first()
    const hasLightClass = await firstCell.evaluate(el => el.classList.contains('light'))
    expect(hasLightClass).toBe(true)
    
    const secondCell = await page.locator('.board .row').first().locator('.cell').nth(1)
    const hasDarkClass = await secondCell.evaluate(el => el.classList.contains('dark'))
    expect(hasDarkClass).toBe(true)
  })

  test('doit afficher le bouton de réinitialisation', async ({ page }) => {
    const resetButton = await page.locator('.reset-btn')
    await expect(resetButton).toBeVisible()
    
    const buttonText = await resetButton.textContent()
    expect(buttonText).toContain('Réinitialiser')
  })

  test('doit afficher la section historique', async ({ page }) => {
    const historyTitle = await page.locator('.history-container h2').textContent()
    expect(historyTitle).toBe('Historique des coups')
  })

  test('doit afficher "Aucun coup joué" au début', async ({ page }) => {
    const noHistory = await page.locator('.no-history').textContent()
    expect(noHistory).toContain('Aucun coup joué')
  })

  test('doit sélectionner une pièce au clic', async ({ page }) => {
    // Cliquer sur le pion blanc en e2 (rangée 6, colonne 4)
    const pawn = await page.locator('.board .row').nth(6).locator('.cell').nth(4)
    await pawn.click()
    
    // Vérifier que la case est sélectionnée
    const isSelected = await pawn.evaluate(el => el.classList.contains('selected'))
    expect(isSelected).toBe(true)
  })

  test('doit déplacer une pièce vers une case vide', async ({ page }) => {
    // Cliquer sur le pion blanc en e2 (rangée 6, colonne 4)
    await page.locator('.board .row').nth(6).locator('.cell').nth(4).click()
    
    // Attendre un petit instant pour la sélection
    await page.waitForTimeout(100)
    
    // Cliquer sur la case de destination e4 (rangée 4, colonne 4)
    await page.locator('.board .row').nth(4).locator('.cell').nth(4).click()
    
    // Vérifier que la pièce a été déplacée
    const sourcePiece = await page.locator('.board .row').nth(6).locator('.cell').nth(4).locator('.piece').count()
    expect(sourcePiece).toBe(0)
    
    const destPiece = await page.locator('.board .row').nth(4).locator('.cell').nth(4).locator('.piece').count()
    expect(destPiece).toBe(1)
  })

  test('doit mettre à jour l\'historique après un déplacement', async ({ page }) => {
    // Déplacer le pion blanc de e2 à e4
    await page.locator('.board .row').nth(6).locator('.cell').nth(4).click()
    await page.waitForTimeout(100)
    await page.locator('.board .row').nth(4).locator('.cell').nth(4).click()
    
    // Attendre que l'historique se mette à jour
    await page.waitForTimeout(200)
    
    // Vérifier que l'historique contient un coup
    const historyItems = await page.locator('.history-item').count()
    expect(historyItems).toBe(1)
    
    // Vérifier que le premier coup est affiché (sans vérifier le texte exact)
    const moveNumber = await page.locator('.history-item .move-number').first().textContent()
    expect(moveNumber).toBe('Coup 1')
    
    // Vérifier que les détails du coup contiennent la pièce déplacée (pion blanc)
    const moveDetails = await page.locator('.history-item .move-details').first().textContent()
    expect(moveDetails).toContain('♙') // Vérifie que c'est un pion blanc
})

  test('doit permettre de déplacer plusieurs pièces', async ({ page }) => {
    // Déplacer le pion blanc de e2 à e4
    await page.locator('.board .row').nth(6).locator('.cell').nth(4).click()
    await page.waitForTimeout(100)
    await page.locator('.board .row').nth(4).locator('.cell').nth(4).click()
    await page.waitForTimeout(100)
    
    // Déplacer le pion noir de e7 à e5
    await page.locator('.board .row').nth(1).locator('.cell').nth(4).click()
    await page.waitForTimeout(100)
    await page.locator('.board .row').nth(3).locator('.cell').nth(4).click()
    await page.waitForTimeout(100)
    
    // Vérifier l'historique
    const historyItems = await page.locator('.history-item').count()
    expect(historyItems).toBe(2)
  })

  test('doit remplacer une pièce sur une case occupée', async ({ page }) => {
    // Déplacer le pion blanc de e2 directement sur le pion noir de e7
    // (mouvement invalide aux échecs mais autorisé dans notre app)
    await page.locator('.board .row').nth(6).locator('.cell').nth(4).click()
    await page.waitForTimeout(100)
    await page.locator('.board .row').nth(1).locator('.cell').nth(4).click()
    await page.waitForTimeout(100)
    
    // Vérifier qu'il n'y a qu'une seule pièce sur cette case
    const pieces = await page.locator('.board .row').nth(1).locator('.cell').nth(4).locator('.piece').count()
    expect(pieces).toBe(1)
    
    // Vérifier que c'est une pièce blanche
    const isWhite = await page.locator('.board .row').nth(1).locator('.cell').nth(4).locator('.piece.white').count()
    expect(isWhite).toBe(1)
    
    // Vérifier la capture dans l'historique
    const moveDetails = await page.locator('.history-item .move-details').first().textContent()
    expect(moveDetails).toContain('capture')
  })

  test('doit désélectionner une pièce en cliquant dessus à nouveau', async ({ page }) => {
    const cell = await page.locator('.board .row').nth(6).locator('.cell').nth(4)
    
    // Première sélection
    await cell.click()
    await page.waitForTimeout(100)
    let isSelected = await cell.evaluate(el => el.classList.contains('selected'))
    expect(isSelected).toBe(true)
    
    // Désélection
    await cell.click()
    await page.waitForTimeout(100)
    isSelected = await cell.evaluate(el => el.classList.contains('selected'))
    expect(isSelected).toBe(false)
  })

  test('doit réinitialiser le plateau avec le bouton reset', async ({ page }) => {
    // Faire quelques déplacements
    await page.locator('.board .row').nth(6).locator('.cell').nth(4).click()
    await page.waitForTimeout(100)
    await page.locator('.board .row').nth(4).locator('.cell').nth(4).click()
    await page.waitForTimeout(200)
    
    // Vérifier qu'il y a un historique
    let historyItems = await page.locator('.history-item').count()
    expect(historyItems).toBeGreaterThan(0)
    
    // Cliquer sur le bouton reset
    await page.locator('.reset-btn').click()
    await page.waitForTimeout(200)
    
    // Vérifier que l'historique est vide
    const noHistory = await page.locator('.no-history').isVisible()
    expect(noHistory).toBe(true)
    
    // Vérifier que les pièces sont revenues à leur position initiale
    const whitePawnsRow6 = await page.locator('.board .row').nth(6).locator('.piece.white').count()
    expect(whitePawnsRow6).toBe(8)
  })

  test('ne doit pas déplacer depuis une case vide', async ({ page }) => {
    // Cliquer sur une case vide au milieu du plateau
    const emptyCell = await page.locator('.board .row').nth(4).locator('.cell').nth(4)
    await emptyCell.click()
    await page.waitForTimeout(100)
    
    // Vérifier qu'elle n'est pas sélectionnée
    const isSelected = await emptyCell.evaluate(el => el.classList.contains('selected'))
    expect(isSelected).toBe(false)
  })

  test('doit permettre des déplacements non conventionnels', async ({ page }) => {
    // Déplacer la tour blanche directement au milieu du plateau
    // (normalement impossible à cause des pions)
    await page.locator('.board .row').nth(7).locator('.cell').nth(0).click()
    await page.waitForTimeout(100)
    await page.locator('.board .row').nth(4).locator('.cell').nth(4).click()
    await page.waitForTimeout(100)
    
    // Vérifier que le mouvement a été effectué
    const sourcePiece = await page.locator('.board .row').nth(7).locator('.cell').nth(0).locator('.piece').count()
    expect(sourcePiece).toBe(0)
    
    const destPiece = await page.locator('.board .row').nth(4).locator('.cell').nth(4).locator('.piece').count()
    expect(destPiece).toBe(1)
  })

  test('doit afficher visuellement le style hover sur les cases', async ({ page }) => {
    const cell = await page.locator('.board .row').nth(4).locator('.cell').nth(4)
    
    // Survoler la case
    await cell.hover()
    await page.waitForTimeout(100)
    
    // On ne peut pas facilement tester le CSS :hover, mais on vérifie que la case est interactive
    const isClickable = await cell.evaluate(el => {
      const style = window.getComputedStyle(el)
      return style.cursor === 'pointer'
    })
    expect(isClickable).toBe(true)
  })
})