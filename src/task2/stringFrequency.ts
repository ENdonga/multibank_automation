/**
 * Task 2: String Character Frequency
 */

export function characterFrequency(input: string): string {
    if (input.length === 0) return '';

    const freq = new Map<string, number>();

    // iterate over each charatcer default to 0 if doesn't exist yet and increment by 1
    for (const char of input) {
        freq.set(char, (freq.get(char) ?? 0) + 1);
    }

    // return the array output and join them by commas
    return Array.from(freq.entries())
        .map(([char, count]) => `${char}:${count}`)
        .join(', ');
}

if (require.main === module) {
    const input = process.argv[2] ?? 'hello world';
    console.log(`Input  : "${input}"`);
    console.log(`Output : ${characterFrequency(input)}`);
}