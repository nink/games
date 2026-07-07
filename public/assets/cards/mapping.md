# Take 5 — Logo & card mapping

**Single source of truth:** `shared/cards.js` → board, deck, and generated tiles all use the same `CARD_CATALOG`.

## Logos on the board (12 brands × 8 cells)

| Rank | Logo | Card ids | Board cells |
|------|------|----------|-------------|
| A | Beacon | A_clubs, A_diamonds, A_hearts, A_spades | 8 |
| 2 | Spark | 2_clubs, 2_diamonds, 2_hearts, 2_spades | 8 |
| 3 | Nova | 3_clubs, 3_diamonds, 3_hearts, 3_spades | 8 |
| 4 | Prism | 4_clubs, 4_diamonds, 4_hearts, 4_spades | 8 |
| 5 | Orbit | 5_clubs, 5_diamonds, 5_hearts, 5_spades | 8 |
| 6 | Pulse | 6_clubs, 6_diamonds, 6_hearts, 6_spades | 8 |
| 7 | Ridge | 7_clubs, 7_diamonds, 7_hearts, 7_spades | 8 |
| 8 | Glyph | 8_clubs, 8_diamonds, 8_hearts, 8_spades | 8 |
| 9 | Apex | 9_clubs, 9_diamonds, 9_hearts, 9_spades | 8 |
| 10 | Flux | 10_clubs, 10_diamonds, 10_hearts, 10_spades | 8 |
| Q | Crown | Q_clubs, Q_diamonds, Q_hearts, Q_spades | 8 |
| K | Shield | K_clubs, K_diamonds, K_hearts, K_spades | 8 |

Corners: **Your Logo** sponsor + Wild (not in deck). Jacks: **Place** / **Remove** (deck only).

## Suit colours

| Suit | Colour |
|------|--------|
| Hearts | Purple |
| Diamonds | Orange |
| Clubs | Yellow |
| Spades | Teal |

## By logo (brand → cards)

### Beacon (`logo_a`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| Ace Hearts | Purple | Beacon · Purple | (1,5), (4,6) |
| Ace Spades | Teal | Beacon · Teal | (2,1), (4,9) |
| Ace Diamonds | Orange | Beacon · Orange | (7,6), (9,1) |
| Ace Clubs | Yellow | Beacon · Yellow | (7,5), (8,0) |

### Spark (`logo_2`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| 2 Hearts | Purple | Spark · Purple | (5,4), (8,7) |
| 2 Spades | Teal | Spark · Teal | (0,1), (8,6) |
| 2 Diamonds | Orange | Spark · Orange | (2,2), (5,9) |
| 2 Clubs | Yellow | Spark · Yellow | (1,4), (3,6) |

### Nova (`logo_3`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| 3 Hearts | Purple | Nova · Purple | (5,5), (8,8) |
| 3 Spades | Teal | Nova · Teal | (0,2), (8,5) |
| 3 Diamonds | Orange | Nova · Orange | (2,3), (6,9) |
| 3 Clubs | Yellow | Nova · Yellow | (1,3), (3,5) |

### Prism (`logo_4`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| 4 Hearts | Purple | Prism · Purple | (4,5), (7,8) |
| 4 Spades | Teal | Prism · Teal | (0,3), (8,4) |
| 4 Diamonds | Orange | Prism · Orange | (2,4), (7,9) |
| 4 Clubs | Yellow | Prism · Yellow | (1,2), (3,4) |

### Orbit (`logo_5`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| 5 Hearts | Purple | Orbit · Purple | (4,4), (6,8) |
| 5 Spades | Teal | Orbit · Teal | (0,4), (8,3) |
| 5 Diamonds | Orange | Orbit · Orange | (2,5), (8,9) |
| 5 Clubs | Yellow | Orbit · Yellow | (1,1), (3,3) |

### Pulse (`logo_6`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| 6 Hearts | Purple | Pulse · Purple | (4,3), (5,8) |
| 6 Spades | Teal | Pulse · Teal | (0,5), (8,2) |
| 6 Diamonds | Orange | Pulse · Orange | (2,6), (9,8) |
| 6 Clubs | Yellow | Pulse · Yellow | (1,0), (3,2) |

### Ridge (`logo_7`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| 7 Hearts | Purple | Ridge · Purple | (4,8), (5,3) |
| 7 Spades | Teal | Ridge · Teal | (0,6), (8,1) |
| 7 Diamonds | Orange | Ridge · Orange | (2,7), (9,7) |
| 7 Clubs | Yellow | Ridge · Yellow | (2,0), (4,2) |

### Glyph (`logo_8`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| 8 Hearts | Purple | Glyph · Purple | (3,8), (6,3) |
| 8 Spades | Teal | Glyph · Teal | (0,7), (7,1) |
| 8 Diamonds | Orange | Glyph · Orange | (3,7), (9,6) |
| 8 Clubs | Yellow | Glyph · Yellow | (3,0), (5,2) |

### Apex (`logo_9`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| 9 Hearts | Purple | Apex · Purple | (2,8), (6,4) |
| 9 Spades | Teal | Apex · Teal | (0,8), (6,1) |
| 9 Diamonds | Orange | Apex · Orange | (4,7), (9,5) |
| 9 Clubs | Yellow | Apex · Yellow | (4,0), (6,2) |

### Flux (`logo_10`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| 10 Hearts | Purple | Flux · Purple | (1,8), (6,5) |
| 10 Spades | Teal | Flux · Teal | (1,9), (5,1) |
| 10 Diamonds | Orange | Flux · Orange | (5,7), (9,4) |
| 10 Clubs | Yellow | Flux · Yellow | (5,0), (7,2) |

### Crown (`logo_q`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| Queen Hearts | Purple | Crown · Purple | (1,7), (6,6) |
| Queen Spades | Teal | Crown · Teal | (2,9), (4,1) |
| Queen Diamonds | Orange | Crown · Orange | (6,7), (9,3) |
| Queen Clubs | Yellow | Crown · Yellow | (6,0), (7,3) |

### Shield (`logo_k`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| King Hearts | Purple | Shield · Purple | (1,6), (5,6) |
| King Spades | Teal | Shield · Teal | (3,1), (3,9) |
| King Diamonds | Orange | Shield · Orange | (7,7), (9,2) |
| King Clubs | Yellow | Shield · Yellow | (7,0), (7,4) |


## Every card (Ace → King, Hearts → Spades → Diamonds → Clubs)

| Card | Logo | Colour | Label | On board | Board positions |
|------|------|--------|-------|----------|-----------------|
| Ace Hearts | Beacon | Purple | Beacon · Purple | yes | (1,5), (4,6) |
| Ace Spades | Beacon | Teal | Beacon · Teal | yes | (2,1), (4,9) |
| Ace Diamonds | Beacon | Orange | Beacon · Orange | yes | (7,6), (9,1) |
| Ace Clubs | Beacon | Yellow | Beacon · Yellow | yes | (7,5), (8,0) |
| 2 Hearts | Spark | Purple | Spark · Purple | yes | (5,4), (8,7) |
| 2 Spades | Spark | Teal | Spark · Teal | yes | (0,1), (8,6) |
| 2 Diamonds | Spark | Orange | Spark · Orange | yes | (2,2), (5,9) |
| 2 Clubs | Spark | Yellow | Spark · Yellow | yes | (1,4), (3,6) |
| 3 Hearts | Nova | Purple | Nova · Purple | yes | (5,5), (8,8) |
| 3 Spades | Nova | Teal | Nova · Teal | yes | (0,2), (8,5) |
| 3 Diamonds | Nova | Orange | Nova · Orange | yes | (2,3), (6,9) |
| 3 Clubs | Nova | Yellow | Nova · Yellow | yes | (1,3), (3,5) |
| 4 Hearts | Prism | Purple | Prism · Purple | yes | (4,5), (7,8) |
| 4 Spades | Prism | Teal | Prism · Teal | yes | (0,3), (8,4) |
| 4 Diamonds | Prism | Orange | Prism · Orange | yes | (2,4), (7,9) |
| 4 Clubs | Prism | Yellow | Prism · Yellow | yes | (1,2), (3,4) |
| 5 Hearts | Orbit | Purple | Orbit · Purple | yes | (4,4), (6,8) |
| 5 Spades | Orbit | Teal | Orbit · Teal | yes | (0,4), (8,3) |
| 5 Diamonds | Orbit | Orange | Orbit · Orange | yes | (2,5), (8,9) |
| 5 Clubs | Orbit | Yellow | Orbit · Yellow | yes | (1,1), (3,3) |
| 6 Hearts | Pulse | Purple | Pulse · Purple | yes | (4,3), (5,8) |
| 6 Spades | Pulse | Teal | Pulse · Teal | yes | (0,5), (8,2) |
| 6 Diamonds | Pulse | Orange | Pulse · Orange | yes | (2,6), (9,8) |
| 6 Clubs | Pulse | Yellow | Pulse · Yellow | yes | (1,0), (3,2) |
| 7 Hearts | Ridge | Purple | Ridge · Purple | yes | (4,8), (5,3) |
| 7 Spades | Ridge | Teal | Ridge · Teal | yes | (0,6), (8,1) |
| 7 Diamonds | Ridge | Orange | Ridge · Orange | yes | (2,7), (9,7) |
| 7 Clubs | Ridge | Yellow | Ridge · Yellow | yes | (2,0), (4,2) |
| 8 Hearts | Glyph | Purple | Glyph · Purple | yes | (3,8), (6,3) |
| 8 Spades | Glyph | Teal | Glyph · Teal | yes | (0,7), (7,1) |
| 8 Diamonds | Glyph | Orange | Glyph · Orange | yes | (3,7), (9,6) |
| 8 Clubs | Glyph | Yellow | Glyph · Yellow | yes | (3,0), (5,2) |
| 9 Hearts | Apex | Purple | Apex · Purple | yes | (2,8), (6,4) |
| 9 Spades | Apex | Teal | Apex · Teal | yes | (0,8), (6,1) |
| 9 Diamonds | Apex | Orange | Apex · Orange | yes | (4,7), (9,5) |
| 9 Clubs | Apex | Yellow | Apex · Yellow | yes | (4,0), (6,2) |
| 10 Hearts | Flux | Purple | Flux · Purple | yes | (1,8), (6,5) |
| 10 Spades | Flux | Teal | Flux · Teal | yes | (1,9), (5,1) |
| 10 Diamonds | Flux | Orange | Flux · Orange | yes | (5,7), (9,4) |
| 10 Clubs | Flux | Yellow | Flux · Yellow | yes | (5,0), (7,2) |
| Jack Hearts | Jack | Purple | Jack (Remove) · Purple | deck only | — (jack / deck only) |
| Jack Spades | Jack | Teal | Jack (Remove) · Teal | deck only | — (jack / deck only) |
| Jack Diamonds | Jack | Orange | Jack (Place) · Orange | deck only | — (jack / deck only) |
| Jack Clubs | Jack | Yellow | Jack (Place) · Yellow | deck only | — (jack / deck only) |
| Queen Hearts | Crown | Purple | Crown · Purple | yes | (1,7), (6,6) |
| Queen Spades | Crown | Teal | Crown · Teal | yes | (2,9), (4,1) |
| Queen Diamonds | Crown | Orange | Crown · Orange | yes | (6,7), (9,3) |
| Queen Clubs | Crown | Yellow | Crown · Yellow | yes | (6,0), (7,3) |
| King Hearts | Shield | Purple | Shield · Purple | yes | (1,6), (5,6) |
| King Spades | Shield | Teal | Shield · Teal | yes | (3,1), (3,9) |
| King Diamonds | Shield | Orange | Shield · Orange | yes | (7,7), (9,2) |
| King Clubs | Shield | Yellow | Shield · Yellow | yes | (7,0), (7,4) |

## Board grid (card id per cell)

```
FREE         2_spades     3_spades     4_spades     5_spades     6_spades     7_spades     8_spades     9_spades     FREE        
6_clubs      5_clubs      4_clubs      3_clubs      2_clubs      A_hearts     K_hearts     Q_hearts     10_hearts    10_spades   
7_clubs      A_spades     2_diamonds   3_diamonds   4_diamonds   5_diamonds   6_diamonds   7_diamonds   9_hearts     Q_spades    
8_clubs      K_spades     6_clubs      5_clubs      4_clubs      3_clubs      2_clubs      8_diamonds   8_hearts     K_spades    
9_clubs      Q_spades     7_clubs      6_hearts     5_hearts     4_hearts     A_hearts     9_diamonds   7_hearts     A_spades    
10_clubs     10_spades    8_clubs      7_hearts     2_hearts     3_hearts     K_hearts     10_diamonds  6_hearts     2_diamonds  
Q_clubs      9_spades     9_clubs      8_hearts     9_hearts     10_hearts    Q_hearts     Q_diamonds   5_hearts     3_diamonds  
K_clubs      8_spades     10_clubs     Q_clubs      K_clubs      A_clubs      A_diamonds   K_diamonds   4_hearts     4_diamonds  
A_clubs      7_spades     6_spades     5_spades     4_spades     3_spades     2_spades     2_hearts     3_hearts     5_diamonds  
FREE         A_diamonds   K_diamonds   Q_diamonds   10_diamonds  9_diamonds   8_diamonds   7_diamonds   6_diamonds   FREE        
```

Corners `FREE` = IBM + Wild (not a deck card).
