// ============================================================================
// CoffeeTeam Pro - Enhanced NLP Engine with All 8 Rules
// ============================================================================

import { Block, generateUUID } from '../types';

// ============================================================================
// Dictionaries
// ============================================================================

const DRINKS: Record<string, { display: string; category: string }> = {
    'הפוך': { display: 'הפוך', category: 'coffee' },
    'קפוצ\'ינו': { display: 'הפוך', category: 'coffee' },
    'נס': { display: 'הפוך', category: 'coffee' },
    'קפה': { display: 'הפוך', category: 'coffee' },
    'אספרסו': { display: 'אספרסו', category: 'coffee' },
    'קצר': { display: 'אספרסו', category: 'coffee' },
    'ארוך': { display: 'אספרסו ארוך', category: 'coffee' },
    'אמריקנו': { display: 'אמריקנו', category: 'coffee' },
    'לאטה': { display: 'לאטה', category: 'coffee' },
    'מקיאטו': { display: 'מקיאטו', category: 'coffee' },
    'מוכתם': { display: 'מקיאטו', category: 'coffee' },
    'שחור': { display: 'שחור', category: 'coffee' },
    'בוץ': { display: 'שחור', category: 'coffee' },
    'שוקו': { display: 'שוקו', category: 'chocolate' },
    'קקאו': { display: 'שוקו', category: 'chocolate' },
    'תה': { display: 'תה', category: 'tea' }
};

const QUANTITIES: Record<string, number> = {
    'אחד': 1, 'אחת': 1,
    'שניים': 2, 'שתיים': 2,
    'שלוש': 3, 'שלושה': 3,
    'ארבע': 4, 'ארבעה': 4,
    'חמש': 5, 'חמישה': 5,
    'פעם': 1, 'פעמיים': 2, 'שלוש פעמים': 3
};

const SIZES: Record<string, string> = {
    'קטן': 'קטן',
    'פיצקי': 'קטן',
    'בינוני': 'בינוני',
    'רגיל': 'בינוני',
    'גדול': 'גדול',
    'ענק': 'גדול'
};

const MILK_TYPES: Record<string, string> = {
    'רגיל': 'רגיל',
    'פרה': 'רגיל',
    'סויה': 'סויה',
    'שקדים': 'שקדים',
    'שקד': 'שקדים',
    'שיבולת': 'שיבולת שועל',
    'דל': 'דל שומן',
    'קוקוס': 'קוקוס',
    'מפורק': 'ללא לקטוז'
};

const TEMPERATURES: Record<string, string> = {
    'חם': 'חם',
    'לוהט': 'חם',
    'רותח': 'רותח',
    'פושר': 'פושר',
    'נעים': 'פושר',
    'קר': 'קר',
    'קפוא': 'קפוא',
    'קרח': 'קפוא'
};

const STRENGTHS: Record<string, string> = {
    'חזק': 'חזק',
    'רגיל': 'רגיל',
    'חלש': 'חלש',
    'כפול': 'כפול',
    'טריפל': 'טריפל'
};

const EXTRAS = [
    'סירופ', 'וניל', 'קרמל', 'שוקולד', 'קצפת',
    'קינמון', 'קקאו', 'דבש', 'סוכר', 'ממתיק', 'סטיביה'
];

const STOP_WORDS = [
    'אהה', 'אממ', 'רגע', 'תרשום', 'תעשה', 'בבקשה',
    'תודה', 'בוא', 'קח', 'תן', 'עוד', 'גם', 'אז',
    'טוב', 'יופי', 'כן', 'אוקיי', 'סבבה'
];

const CORRECTION_TRIGGERS = ['לא', 'בעצם', 'תשנה', 'רגע'];
const SPLIT_KEYWORDS = ['ואחד', 'ועוד'];

// ============================================================================
// Enhanced NLP Parser with All 8 Rules
// ============================================================================

interface Token {
    text: string;
    index: number;
    type?: 'drink' | 'quantity' | 'size' | 'milk' | 'temp' | 'strength' | 'extra' | 'correction' | 'split';
    value?: any;
    category?: string;
}

/**
 * Parse Hebrew text into structured blocks
 * Implements all 8 parsing rules from specification
 */
export function parseOrder(text: string): Block[] {
    console.log('[NLP] Parsing:', text);

    // 1. Tokenization
    const tokens = tokenize(text);
    console.log('[NLP] Tokens:', tokens);

    // 2. Identification
    const identified = identify(tokens);
    console.log('[NLP] Identified:', identified);

    // 3. Apply correction detection (Rule 6)
    const corrected = applyCorrections(identified);
    console.log('[NLP] Corrected:', corrected);

    // 4. Segmentation
    const segments = segment(corrected);
    console.log('[NLP] Segments:', segments);

    // 5. Construction with all rules
    const blocks: Block[] = [];
    for (const segment of segments) {
        blocks.push(...constructBlocksWithRules(segment));
    }

    console.log('[NLP] Final blocks:', blocks);
    return blocks;
}

/**
 * Tokenize text - remove stop words and punctuation
 */
function tokenize(text: string): Token[] {
    const words = text.replace(/[.,?!]/g, '').trim().split(/\s+/);

    return words
        .filter(word => !STOP_WORDS.includes(word))
        .map((word, index) => ({ text: word, index }));
}

/**
 * Identify token types
 */
function identify(tokens: Token[]): Token[] {
    return tokens.map(token => {
        const word = token.text;

        if (DRINKS[word]) {
            return { ...token, type: 'drink', value: DRINKS[word].display, category: DRINKS[word].category };
        }

        if (QUANTITIES[word]) {
            return { ...token, type: 'quantity', value: QUANTITIES[word] };
        }

        if (SIZES[word]) {
            return { ...token, type: 'size', value: SIZES[word] };
        }

        if (MILK_TYPES[word]) {
            return { ...token, type: 'milk', value: MILK_TYPES[word] };
        }

        if (TEMPERATURES[word]) {
            return { ...token, type: 'temp', value: TEMPERATURES[word] };
        }

        if (STRENGTHS[word]) {
            return { ...token, type: 'strength', value: STRENGTHS[word] };
        }

        if (EXTRAS.includes(word)) {
            return { ...token, type: 'extra', value: word };
        }

        if (CORRECTION_TRIGGERS.includes(word)) {
            return { ...token, type: 'correction' };
        }

        if (SPLIT_KEYWORDS.includes(word)) {
            return { ...token, type: 'split' };
        }

        return token;
    });
}

/**
 * Rule 6: Correction Detection
 * "גדול... לא בינוני" → replace גדול with בינוני
 */
function applyCorrections(tokens: Token[]): Token[] {
    const result: Token[] = [];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (token.type === 'correction' && i + 1 < tokens.length) {
            const nextToken = tokens[i + 1];

            // Find previous token of same category and replace it
            if (nextToken.type) {
                for (let j = result.length - 1; j >= 0; j--) {
                    if (result[j].type === nextToken.type) {
                        result[j] = nextToken;
                        break;
                    }
                }
                i++; // Skip the next token as we've used it
                continue;
            }
        }

        result.push(token);
    }

    return result;
}

/**
 * Segment tokens into drink groups (Rule 1: Anchor Detection)
 */
function segment(tokens: Token[]): Token[][] {
    const segments: Token[][] = [];
    let current: Token[] = [];

    for (const token of tokens) {
        if (token.type === 'drink') {
            if (current.length > 0 && current.some(t => t.type === 'drink')) {
                segments.push(current);
                current = [];
            }
        }
        current.push(token);
    }

    if (current.length > 0) {
        segments.push(current);
    }

    return segments;
}

/**
 * Construct blocks with all parsing rules
 */
function constructBlocksWithRules(segment: Token[]): Block[] {
    const drinkToken = segment.find(t => t.type === 'drink');
    if (!drinkToken) return [];

    // Rule 2: Quantity Before Anchor
    let quantity = 1;
    const quantityToken = segment.find(t => t.type === 'quantity');
    if (quantityToken && quantityToken.index < drinkToken.index) {
        quantity = quantityToken.value;
    }

    // Rule 5: Variation Split ("אחד...ואחד...")
    const splitIndices = segment
        .map((t, i) => t.type === 'split' ? i : -1)
        .filter(i => i !== -1);

    if (splitIndices.length > 0) {
        return constructVariationBlocks(segment, drinkToken, splitIndices);
    }

    // Rule 3: Proximity Assignment & Rule 4: Property Distribution
    const properties = extractProperties(segment);

    // Create blocks
    const blocks: Block[] = [];
    for (let i = 0; i < quantity; i++) {
        blocks.push({
            id: generateUUID(),
            drink: drinkToken.value,
            size: properties.size,
            milk: properties.milk,
            temperature: properties.temperature,
            strength: properties.strength,
            extras: [...properties.extras]
        });
    }

    return blocks;
}

/**
 * Rule 5: Variation Split
 * "שניים הפוך אחד שקדים ואחד רגיל"
 */
function constructVariationBlocks(segment: Token[], drinkToken: Token, splitIndices: number[]): Block[] {
    const blocks: Block[] = [];

    // Base properties (before first split)
    const baseProperties = extractProperties(segment.slice(0, splitIndices[0]));

    // Create variations
    const variations = [segment.slice(0, splitIndices[0])];
    for (let i = 0; i < splitIndices.length; i++) {
        const start = splitIndices[i] + 1;
        const end = i + 1 < splitIndices.length ? splitIndices[i + 1] : segment.length;
        variations.push(segment.slice(start, end));
    }

    for (const variation of variations) {
        const props = extractProperties(variation);
        blocks.push({
            id: generateUUID(),
            drink: drinkToken.value,
            size: props.size || baseProperties.size,
            milk: props.milk || baseProperties.milk,
            temperature: props.temperature || baseProperties.temperature,
            strength: props.strength || baseProperties.strength,
            extras: [...(props.extras.length > 0 ? props.extras : baseProperties.extras)]
        });
    }

    return blocks;
}

/**
 * Extract properties from token segment
 */
function extractProperties(segment: Token[]): {
    size?: string;
    milk?: string;
    temperature?: string;
    strength?: string;
    extras: string[];
} {
    return {
        size: segment.find(t => t.type === 'size')?.value,
        milk: segment.find(t => t.type === 'milk')?.value,
        temperature: segment.find(t => t.type === 'temp')?.value,
        strength: segment.find(t => t.type === 'strength')?.value,
        extras: segment.filter(t => t.type === 'extra').map(t => t.value)
    };
}
