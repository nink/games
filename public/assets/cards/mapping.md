# Take 5 — Logo & card mapping

**Single source of truth:** `shared/cards.js` → board, deck, and generated tiles all use the same `CARD_CATALOG`.

## Logos on the board (12 brands × 8 cells)

| Rank | Logo | Card ids | Board cells |
|------|------|----------|-------------|
| A | McDonald's | A_clubs, A_diamonds, A_hearts, A_spades | 8 |
| 2 | Apple | 2_clubs, 2_diamonds, 2_hearts, 2_spades | 8 |
| 3 | Google | 3_clubs, 3_diamonds, 3_hearts, 3_spades | 8 |
| 4 | Amazon | 4_clubs, 4_diamonds, 4_hearts, 4_spades | 8 |
| 5 | Netflix | 5_clubs, 5_diamonds, 5_hearts, 5_spades | 8 |
| 6 | Walmart | 6_clubs, 6_diamonds, 6_hearts, 6_spades | 8 |
| 7 | Starbucks | 7_clubs, 7_diamonds, 7_hearts, 7_spades | 8 |
| 8 | BMW | 8_clubs, 8_diamonds, 8_hearts, 8_spades | 8 |
| 9 | Nike | 9_clubs, 9_diamonds, 9_hearts, 9_spades | 8 |
| 10 | Burger King | 10_clubs, 10_diamonds, 10_hearts, 10_spades | 8 |
| Q | Subway | Q_clubs, Q_diamonds, Q_hearts, Q_spades | 8 |
| K | KFC | K_clubs, K_diamonds, K_hearts, K_spades | 8 |

Corners: **IBM** + Wild (not in deck). Jacks: **Coke** / **Pepsi** (deck only).

## Suit colours

| Suit | Colour |
|------|--------|
| Hearts | Red |
| Diamonds | Green |
| Clubs | Yellow |
| Spades | Blue |

## By logo (brand → cards)

### McDonald's (`mcdonalds`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| Ace Hearts | Red | McDonald's · Red | (1,5), (4,6) |
| Ace Spades | Blue | McDonald's · Blue | (2,1), (4,9) |
| Ace Diamonds | Green | McDonald's · Green | (7,6), (9,1) |
| Ace Clubs | Yellow | McDonald's · Yellow | (7,5), (8,0) |

### Apple (`apple`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| 2 Hearts | Red | Apple · Red | (5,4), (8,7) |
| 2 Spades | Blue | Apple · Blue | (0,1), (8,6) |
| 2 Diamonds | Green | Apple · Green | (2,2), (5,9) |
| 2 Clubs | Yellow | Apple · Yellow | (1,4), (3,6) |

### Google (`google`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| 3 Hearts | Red | Google · Red | (5,5), (8,8) |
| 3 Spades | Blue | Google · Blue | (0,2), (8,5) |
| 3 Diamonds | Green | Google · Green | (2,3), (6,9) |
| 3 Clubs | Yellow | Google · Yellow | (1,3), (3,5) |

### Amazon (`amazon`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| 4 Hearts | Red | Amazon · Red | (4,5), (7,8) |
| 4 Spades | Blue | Amazon · Blue | (0,3), (8,4) |
| 4 Diamonds | Green | Amazon · Green | (2,4), (7,9) |
| 4 Clubs | Yellow | Amazon · Yellow | (1,2), (3,4) |

### Netflix (`netflix`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| 5 Hearts | Red | Netflix · Red | (4,4), (6,8) |
| 5 Spades | Blue | Netflix · Blue | (0,4), (8,3) |
| 5 Diamonds | Green | Netflix · Green | (2,5), (8,9) |
| 5 Clubs | Yellow | Netflix · Yellow | (1,1), (3,3) |

### Walmart (`walmart`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| 6 Hearts | Red | Walmart · Red | (4,3), (5,8) |
| 6 Spades | Blue | Walmart · Blue | (0,5), (8,2) |
| 6 Diamonds | Green | Walmart · Green | (2,6), (9,8) |
| 6 Clubs | Yellow | Walmart · Yellow | (1,0), (3,2) |

### Starbucks (`starbucks`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| 7 Hearts | Red | Starbucks · Red | (4,8), (5,3) |
| 7 Spades | Blue | Starbucks · Blue | (0,6), (8,1) |
| 7 Diamonds | Green | Starbucks · Green | (2,7), (9,7) |
| 7 Clubs | Yellow | Starbucks · Yellow | (2,0), (4,2) |

### BMW (`bmw`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| 8 Hearts | Red | BMW · Red | (3,8), (6,3) |
| 8 Spades | Blue | BMW · Blue | (0,7), (7,1) |
| 8 Diamonds | Green | BMW · Green | (3,7), (9,6) |
| 8 Clubs | Yellow | BMW · Yellow | (3,0), (5,2) |

### Nike (`nike`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| 9 Hearts | Red | Nike · Red | (2,8), (6,4) |
| 9 Spades | Blue | Nike · Blue | (0,8), (6,1) |
| 9 Diamonds | Green | Nike · Green | (4,7), (9,5) |
| 9 Clubs | Yellow | Nike · Yellow | (4,0), (6,2) |

### Burger King (`burgerking`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| 10 Hearts | Red | Burger King · Red | (1,8), (6,5) |
| 10 Spades | Blue | Burger King · Blue | (1,9), (5,1) |
| 10 Diamonds | Green | Burger King · Green | (5,7), (9,4) |
| 10 Clubs | Yellow | Burger King · Yellow | (5,0), (7,2) |

### Subway (`subway`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| Queen Hearts | Red | Subway · Red | (1,7), (6,6) |
| Queen Spades | Blue | Subway · Blue | (2,9), (4,1) |
| Queen Diamonds | Green | Subway · Green | (6,7), (9,3) |
| Queen Clubs | Yellow | Subway · Yellow | (6,0), (7,3) |

### KFC (`kfc`)

Board cells: **8** (deck: 4 suit variants; jacks deck-only)

| Card | Colour | Label | Board positions |
|------|--------|-------|-----------------|
| King Hearts | Red | KFC · Red | (1,6), (5,6) |
| King Spades | Blue | KFC · Blue | (3,1), (3,9) |
| King Diamonds | Green | KFC · Green | (7,7), (9,2) |
| King Clubs | Yellow | KFC · Yellow | (7,0), (7,4) |


## Every card (Ace → King, Hearts → Spades → Diamonds → Clubs)

| Card | Logo | Colour | Label | On board | Board positions |
|------|------|--------|-------|----------|-----------------|
| Ace Hearts | McDonald's | Red | McDonald's · Red | yes | (1,5), (4,6) |
| Ace Spades | McDonald's | Blue | McDonald's · Blue | yes | (2,1), (4,9) |
| Ace Diamonds | McDonald's | Green | McDonald's · Green | yes | (7,6), (9,1) |
| Ace Clubs | McDonald's | Yellow | McDonald's · Yellow | yes | (7,5), (8,0) |
| 2 Hearts | Apple | Red | Apple · Red | yes | (5,4), (8,7) |
| 2 Spades | Apple | Blue | Apple · Blue | yes | (0,1), (8,6) |
| 2 Diamonds | Apple | Green | Apple · Green | yes | (2,2), (5,9) |
| 2 Clubs | Apple | Yellow | Apple · Yellow | yes | (1,4), (3,6) |
| 3 Hearts | Google | Red | Google · Red | yes | (5,5), (8,8) |
| 3 Spades | Google | Blue | Google · Blue | yes | (0,2), (8,5) |
| 3 Diamonds | Google | Green | Google · Green | yes | (2,3), (6,9) |
| 3 Clubs | Google | Yellow | Google · Yellow | yes | (1,3), (3,5) |
| 4 Hearts | Amazon | Red | Amazon · Red | yes | (4,5), (7,8) |
| 4 Spades | Amazon | Blue | Amazon · Blue | yes | (0,3), (8,4) |
| 4 Diamonds | Amazon | Green | Amazon · Green | yes | (2,4), (7,9) |
| 4 Clubs | Amazon | Yellow | Amazon · Yellow | yes | (1,2), (3,4) |
| 5 Hearts | Netflix | Red | Netflix · Red | yes | (4,4), (6,8) |
| 5 Spades | Netflix | Blue | Netflix · Blue | yes | (0,4), (8,3) |
| 5 Diamonds | Netflix | Green | Netflix · Green | yes | (2,5), (8,9) |
| 5 Clubs | Netflix | Yellow | Netflix · Yellow | yes | (1,1), (3,3) |
| 6 Hearts | Walmart | Red | Walmart · Red | yes | (4,3), (5,8) |
| 6 Spades | Walmart | Blue | Walmart · Blue | yes | (0,5), (8,2) |
| 6 Diamonds | Walmart | Green | Walmart · Green | yes | (2,6), (9,8) |
| 6 Clubs | Walmart | Yellow | Walmart · Yellow | yes | (1,0), (3,2) |
| 7 Hearts | Starbucks | Red | Starbucks · Red | yes | (4,8), (5,3) |
| 7 Spades | Starbucks | Blue | Starbucks · Blue | yes | (0,6), (8,1) |
| 7 Diamonds | Starbucks | Green | Starbucks · Green | yes | (2,7), (9,7) |
| 7 Clubs | Starbucks | Yellow | Starbucks · Yellow | yes | (2,0), (4,2) |
| 8 Hearts | BMW | Red | BMW · Red | yes | (3,8), (6,3) |
| 8 Spades | BMW | Blue | BMW · Blue | yes | (0,7), (7,1) |
| 8 Diamonds | BMW | Green | BMW · Green | yes | (3,7), (9,6) |
| 8 Clubs | BMW | Yellow | BMW · Yellow | yes | (3,0), (5,2) |
| 9 Hearts | Nike | Red | Nike · Red | yes | (2,8), (6,4) |
| 9 Spades | Nike | Blue | Nike · Blue | yes | (0,8), (6,1) |
| 9 Diamonds | Nike | Green | Nike · Green | yes | (4,7), (9,5) |
| 9 Clubs | Nike | Yellow | Nike · Yellow | yes | (4,0), (6,2) |
| 10 Hearts | Burger King | Red | Burger King · Red | yes | (1,8), (6,5) |
| 10 Spades | Burger King | Blue | Burger King · Blue | yes | (1,9), (5,1) |
| 10 Diamonds | Burger King | Green | Burger King · Green | yes | (5,7), (9,4) |
| 10 Clubs | Burger King | Yellow | Burger King · Yellow | yes | (5,0), (7,2) |
| Jack Hearts | Pepsi | Red | Pepsi (Remove) · Red | deck only | — (jack / deck only) |
| Jack Spades | Pepsi | Blue | Pepsi (Remove) · Blue | deck only | — (jack / deck only) |
| Jack Diamonds | Coke | Green | Coke (Wild) · Green | deck only | — (jack / deck only) |
| Jack Clubs | Coke | Yellow | Coke (Wild) · Yellow | deck only | — (jack / deck only) |
| Queen Hearts | Subway | Red | Subway · Red | yes | (1,7), (6,6) |
| Queen Spades | Subway | Blue | Subway · Blue | yes | (2,9), (4,1) |
| Queen Diamonds | Subway | Green | Subway · Green | yes | (6,7), (9,3) |
| Queen Clubs | Subway | Yellow | Subway · Yellow | yes | (6,0), (7,3) |
| King Hearts | KFC | Red | KFC · Red | yes | (1,6), (5,6) |
| King Spades | KFC | Blue | KFC · Blue | yes | (3,1), (3,9) |
| King Diamonds | KFC | Green | KFC · Green | yes | (7,7), (9,2) |
| King Clubs | KFC | Yellow | KFC · Yellow | yes | (7,0), (7,4) |

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
