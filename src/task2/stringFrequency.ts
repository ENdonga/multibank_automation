/**
 * Task 2: String Character Frequency
 */

export function characterFrequency(input: string): string {
    if (input.length === 0) return '';

    const freq = new Map<string, number>();

    for (const char of input) {
        freq.set(char, (freq.get(char) ?? 0) + 1);
    }

    return Array.from(freq.entries())
        .map(([char, count]) => `${char}:${count}`)
        .join(', ');
}

if (require.main === module) {
    const input = process.argv[2] ?? 'hello world';
    console.log(`Input  : "${input}"`);
    console.log(`Output : ${characterFrequency(input)}`);
}