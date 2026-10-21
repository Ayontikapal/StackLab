import type { Token, OperatorInfo, Associativity } from './types';

export const OPERATORS: Record<string, OperatorInfo> = {
  '^': { precedence: 4, associativity: 'right', symbol: '^' },
  '*': { precedence: 3, associativity: 'left', symbol: '*' },
  '/': { precedence: 3, associativity: 'left', symbol: '/' },
  '%': { precedence: 3, associativity: 'left', symbol: '%' },
  '+': { precedence: 2, associativity: 'left', symbol: '+' },
  '-': { precedence: 2, associativity: 'left', symbol: '-' },
};

export function isOperator(char: string): boolean {
  return char in OPERATORS;
}

export function getPrecedence(op: string): number {
  return OPERATORS[op]?.precedence ?? 0;
}

export function getAssociativity(op: string): Associativity {
  return OPERATORS[op]?.associativity ?? 'left';
}

export interface ValidationResult {
  isValid: boolean;
  tokens: Token[];
  error?: string;
}

/**
 * Tokenizes an infix math expression and performs syntax validation.
 */
export function tokenizeInfix(input: string): ValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      isValid: false,
      tokens: [],
      error: 'Please enter a valid mathematical expression.',
    };
  }

  const tokens: Token[] = [];
  let i = 0;
  let tokenIndex = 0;

  while (i < input.length) {
    const char = input[i];

    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Left parenthesis
    if (char === '(') {
      tokens.push({
        id: `token-${tokenIndex}-${char}`,
        value: '(',
        type: 'left_paren',
        index: tokenIndex++,
      });
      i++;
      continue;
    }

    // Right parenthesis
    if (char === ')') {
      tokens.push({
        id: `token-${tokenIndex}-${char}`,
        value: ')',
        type: 'right_paren',
        index: tokenIndex++,
      });
      i++;
      continue;
    }

    // Operators
    if (isOperator(char)) {
      tokens.push({
        id: `token-${tokenIndex}-${char}`,
        value: char,
        type: 'operator',
        index: tokenIndex++,
      });
      i++;
      continue;
    }

    // Operands: Numbers (including multidigit and decimals)
    if (/[0-9]/.test(char)) {
      let numStr = '';
      while (i < input.length && /[0-9.]/.test(input[i])) {
        numStr += input[i];
        i++;
      }
      // Check for valid number format (not multiple decimals)
      const parsed = parseFloat(numStr);
      if (isNaN(parsed)) {
        return {
          isValid: false,
          tokens: [],
          error: `Malformed numeric literal: "${numStr}"`,
        };
      }
      tokens.push({
        id: `token-${tokenIndex}-${numStr}`,
        value: numStr,
        type: 'operand',
        index: tokenIndex++,
        isNumeric: true,
        numericValue: parsed,
      });
      continue;
    }

    // Operands: Variables / Letters (e.g., A, B, x, y)
    if (/[a-zA-Z]/.test(char)) {
      let varStr = '';
      while (i < input.length && /[a-zA-Z0-9_]/.test(input[i])) {
        varStr += input[i];
        i++;
      }
      tokens.push({
        id: `token-${tokenIndex}-${varStr}`,
        value: varStr,
        type: 'operand',
        index: tokenIndex++,
        isNumeric: false,
      });
      continue;
    }

    // Unexpected character
    return {
      isValid: false,
      tokens: [],
      error: `Unexpected character: '${char}' at position ${i + 1}`,
    };
  }

  // Syntax and structure validation
  if (tokens.length === 0) {
    return {
      isValid: false,
      tokens: [],
      error: 'Expression contains no valid tokens.',
    };
  }

  // Check balanced parentheses
  let openParens = 0;
  for (const token of tokens) {
    if (token.type === 'left_paren') {
      openParens++;
    } else if (token.type === 'right_paren') {
      openParens--;
      if (openParens < 0) {
        return {
          isValid: false,
          tokens,
          error: 'Mismatched parentheses: closing bracket without opening bracket.',
        };
      }
    }
  }

  if (openParens > 0) {
    return {
      isValid: false,
      tokens,
      error: `Mismatched parentheses: ${openParens} unclosed opening bracket(s).`,
    };
  }

  // Check consecutive operators or invalid start/end
  if (tokens[0].type === 'operator') {
    return {
      isValid: false,
      tokens,
      error: `Expression cannot begin with operator '${tokens[0].value}'.`,
    };
  }

  const lastToken = tokens[tokens.length - 1];
  if (lastToken.type === 'operator') {
    return {
      isValid: false,
      tokens,
      error: `Expression cannot end with operator '${lastToken.value}'.`,
    };
  }

  for (let j = 0; j < tokens.length - 1; j++) {
    const curr = tokens[j];
    const next = tokens[j + 1];

    if (curr.type === 'operator' && next.type === 'operator') {
      return {
        isValid: false,
        tokens,
        error: `Consecutive operators '${curr.value}' and '${next.value}' are not allowed.`,
      };
    }

    if (curr.type === 'left_paren' && next.type === 'operator') {
      return {
        isValid: false,
        tokens,
        error: `Operator '${next.value}' immediately after '(' is invalid.`,
      };
    }

    if (curr.type === 'operator' && next.type === 'right_paren') {
      return {
        isValid: false,
        tokens,
        error: `Operator '${curr.value}' immediately before ')' is invalid.`,
      };
    }

    if (curr.type === 'left_paren' && next.type === 'right_paren') {
      return {
        isValid: false,
        tokens,
        error: 'Empty parentheses "()" are not allowed.',
      };
    }

    if (curr.type === 'operand' && next.type === 'operand') {
      return {
        isValid: false,
        tokens,
        error: `Missing operator between operands '${curr.value}' and '${next.value}'.`,
      };
    }
  }

  return {
    isValid: true,
    tokens,
  };
}
