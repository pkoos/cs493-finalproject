export function generate_dice_roll(numDice: number, numSides: number): number {
    let total: number = 0
    for (let i = 0; i < numDice; i++) {
        total += Math.floor(Math.random() * numSides + 1)
    }
    return total
}
