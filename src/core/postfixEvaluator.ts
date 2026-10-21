import { Stack } from './stack';
import type {
  Token,
  StackItem,
  EvalStep,
  EvalTraceResult,
} from './types';

/**
 * Performs basic arithmetic operation.
 */
function applyOperator(op: string, a: number, b: number): { result: number; error?: string } {
  switch (op) {
    case '+':
      return { result: a + b };
    case '-':
      return { result: a - b };
    case '*':
      return { result: a * b };
    case '/':
      if (b === 0) {
        return { result: 0, error: 'Division by zero is undefined.' };
      }
      return { result: a / b };
    case '%':
      if (b === 0) {
        return { result: 0, error: 'Modulo by zero is undefined.' };
      }
      return { result: a % b };
    case '^':
      return { result: Math.pow(a, b) };
    default:
      return { result: 0, error: `Unsupported operator: ${op}` };
  }
}

/**
 * Parses and validates a space-separated postfix string into tokens.
 */
export function parsePostfixString(input: string): { isValid: boolean; tokens: Token[]; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      isValid: false,
      tokens: [],
      error: 'Please enter a valid postfix expression.',
    };
  }

  const rawTokens = trimmed.split(/\s+/);
  const tokens: Token[] = [];
  const supportedOps = ['+', '-', '*', '/', '^', '%'];

  for (let idx = 0; idx < rawTokens.length; idx++) {
    const raw = rawTokens[idx];
    if (supportedOps.includes(raw)) {
      tokens.push({
        id: `eval-token-${idx}-${raw}`,
        value: raw,
        type: 'operator',
        index: idx,
      });
    } else {
      const num = Number(raw);
      if (isNaN(num)) {
        return {
          isValid: false,
          tokens: [],
          error: `Invalid token "${raw}" at position ${idx + 1}. Expected a numeric operand or supported operator (+, -, *, /, ^).`,
        };
      }
      tokens.push({
        id: `eval-token-${idx}-${raw}`,
        value: raw,
        type: 'operand',
        index: idx,
        isNumeric: true,
        numericValue: num,
      });
    }
  }

  return { isValid: true, tokens };
}

/**
 * Evaluates a postfix token stream step-by-step, recording animation states.
 */
export function generatePostfixEvalTrace(tokens: Token[]): EvalTraceResult {
  if (!tokens || tokens.length === 0) {
    return {
      tokens: [],
      steps: [
        {
          stepIndex: 0,
          action: 'error',
          currentTokenIndex: -1,
          currentToken: null,
          evalStack: [],
          explanation: 'No tokens provided for evaluation.',
          error: 'Empty postfix token stream',
        },
      ],
      finalResult: null,
      isValid: false,
      errorMessage: 'No tokens provided for evaluation.',
    };
  }

  // Check if expression has non-numeric operands
  const nonNumeric = tokens.find((t) => t.type === 'operand' && !t.isNumeric && isNaN(Number(t.value)));
  if (nonNumeric) {
    return {
      tokens,
      steps: [
        {
          stepIndex: 0,
          action: 'error',
          currentTokenIndex: -1,
          currentToken: nonNumeric,
          evalStack: [],
          explanation: `Evaluation requires numeric values, but variable operand "${nonNumeric.value}" was found.`,
          error: `Non-numeric operand: "${nonNumeric.value}"`,
        },
      ],
      finalResult: null,
      isValid: false,
      errorMessage: `Evaluation requires numbers (e.g. 2 + 3 * 4), but found variable '${nonNumeric.value}'.`,
    };
  }

  const steps: EvalStep[] = [];
  const evalStack = new Stack<StackItem>();
  let stepCount = 0;

  // Step 0: Start
  steps.push({
    stepIndex: stepCount++,
    action: 'start',
    currentTokenIndex: -1,
    currentToken: null,
    evalStack: evalStack.toArray(),
    explanation: 'Begin Postfix Expression Evaluation with empty operand stack.',
  });

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'operand') {
      const numVal = token.numericValue ?? Number(token.value);
      const item: StackItem = {
        id: `eval-stack-${token.id}`,
        value: token.value,
        isNumeric: true,
        numericValue: numVal,
      };
      evalStack.push(item);

      steps.push({
        stepIndex: stepCount++,
        action: 'push_operand',
        currentTokenIndex: i,
        currentToken: token,
        evalStack: evalStack.toArray(),
        explanation: `Operand "${token.value}" encountered. Push onto operand evaluation stack.`,
        pushingResult: item,
      });
    } else if (token.type === 'operator') {
      const op = token.value;

      // Need 2 operands
      if (evalStack.size() < 2) {
        steps.push({
          stepIndex: stepCount++,
          action: 'error',
          currentTokenIndex: i,
          currentToken: token,
          evalStack: evalStack.toArray(),
          explanation: `Evaluation error: Insufficient operands on stack for operator "${op}".`,
          error: 'Stack underflow during evaluation',
        });
        return {
          tokens,
          steps,
          finalResult: null,
          isValid: false,
          errorMessage: 'Malformed postfix expression: not enough operands for operator.',
        };
      }
      const rightOperand = evalStack.pop()!;
      const leftOperand = evalStack.pop()!;

      // Sub-step: Pop operands
      steps.push({
        stepIndex: stepCount++,
        action: 'pop_operands',
        currentTokenIndex: i,
        currentToken: token,
        evalStack: evalStack.toArray(),
        explanation: `Binary operator "${op}" encountered. Pop right operand (${rightOperand.value}) first, then pop left operand (${leftOperand.value}).`,
        poppedOperands: {
          left: leftOperand,
          right: rightOperand,
          operator: op,
        },
      });

      const a = leftOperand.numericValue ?? Number(leftOperand.value);
      const b = rightOperand.numericValue ?? Number(rightOperand.value);

      const opResult = applyOperator(op, a, b);

      if (opResult.error) {
        steps.push({
          stepIndex: stepCount++,
          action: 'error',
          currentTokenIndex: i,
          currentToken: token,
          evalStack: evalStack.toArray(),
          explanation: `Math error: ${opResult.error}`,
          error: opResult.error,
        });
        return {
          tokens,
          steps,
          finalResult: null,
          isValid: false,
          errorMessage: opResult.error,
        };
      }

      // Round to 4 decimal places if float to keep display clean
      const rawRes = opResult.result;
      const roundedRes = Math.round(rawRes * 10000) / 10000;
      const formula = `${a} ${op} ${b} = ${roundedRes}`;

      // Sub-step: Evaluating calculation
      steps.push({
        stepIndex: stepCount++,
        action: 'evaluating',
        currentTokenIndex: i,
        currentToken: token,
        evalStack: evalStack.toArray(),
        explanation: `Calculate: ${formula}`,
        poppedOperands: {
          left: leftOperand,
          right: rightOperand,
          operator: op,
        },
        activeCalculation: {
          leftVal: a,
          rightVal: b,
          operator: op,
          result: roundedRes,
          formula,
        },
      });

      // Sub-step: Push result
      const resultItem: StackItem = {
        id: `eval-res-${i}-${roundedRes}`,
        value: String(roundedRes),
        isNumeric: true,
        numericValue: roundedRes,
      };
      evalStack.push(resultItem);

      steps.push({
        stepIndex: stepCount++,
        action: 'push_result',
        currentTokenIndex: i,
        currentToken: token,
        evalStack: evalStack.toArray(),
        explanation: `Push computed result (${roundedRes}) back onto evaluation stack.`,
        pushingResult: resultItem,
        activeCalculation: {
          leftVal: a,
          rightVal: b,
          operator: op,
          result: roundedRes,
          formula,
        },
      });
    }
  }

  // After processing all tokens, exactly one value should remain
  if (evalStack.size() !== 1) {
    steps.push({
      stepIndex: stepCount++,
      action: 'error',
      currentTokenIndex: -1,
      currentToken: null,
      evalStack: evalStack.toArray(),
      explanation: `Invalid postfix expression: expected 1 final result on stack, found ${evalStack.size()}.`,
      error: 'Unconsumed operands remaining',
    });
    return {
      tokens,
      steps,
      finalResult: null,
      isValid: false,
      errorMessage: 'Invalid postfix expression: too many operands remaining.',
    };
  }

  const finalItem = evalStack.peek()!;
  const finalVal = finalItem.numericValue ?? Number(finalItem.value);

  steps.push({
    stepIndex: stepCount++,
    action: 'complete',
    currentTokenIndex: -1,
    currentToken: null,
    evalStack: evalStack.toArray(),
    explanation: `Evaluation finished successfully! Final computed value: ${finalVal}`,
    finalResult: finalVal,
  });

  return {
    tokens,
    steps,
    finalResult: finalVal,
    isValid: true,
  };
}
