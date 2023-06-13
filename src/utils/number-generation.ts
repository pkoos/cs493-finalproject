export function generate_dice_roll(numSides: number, numDice: number = 1): number {
    let total: number = 0
    for (let i = 0; i < numDice; i++) {
        total += Math.floor(Math.random() * numSides + 1)
    }
    return total
}
