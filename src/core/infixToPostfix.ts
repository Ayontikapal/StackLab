import { Stack } from './stack';
import { tokenizeInfix, getPrecedence, getAssociativity, isOperator } from './tokenizer';
import type {
  Token,
  StackItem,
  InfixStep,
  TraceResult,
} from './types';

/**
 * Converts an infix mathematical expression to postfix (Reverse Polish Notation)
 * and records a complete step-by-step execution trace for animation.
 */
export function generateInfixToPostfixTrace(input: string): TraceResult {
  const validation = tokenizeInfix(input);
  if (!validation.isValid) {
    return {
      tokens: [],
      steps: [
        {
          stepIndex: 0,
          action: 'error',
          currentTokenIndex: -1,
          currentToken: null,
          operatorStack: [],
          postfixOutput: [],
          explanation: validation.error || 'Invalid expression',
          ruleApplied: 'Expression failed syntax validation',
          error: validation.error,
        },
      ],
      finalPostfix: '',
      finalPostfixTokens: [],
      isValid: false,
      errorMessage: validation.error,
    };
  }

  const tokens = validation.tokens;
  const steps: InfixStep[] = [];
  const operatorStack = new Stack<StackItem>();
  const postfixOutput: StackItem[] = [];

  let stepCount = 0;

  // Step 0: Start
  steps.push({
    stepIndex: stepCount++,
    action: 'start',
    currentTokenIndex: -1,
    currentToken: null,
    operatorStack: operatorStack.toArray(),
    postfixOutput: [...postfixOutput],
    explanation: `Starting Infix to Postfix conversion for: "${input.trim()}"`,
    ruleApplied: 'Initialize operator stack and output stream',
  });

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'operand') {
      const item: StackItem = {
        id: `postfix-item-${token.id}`,
        value: token.value,
        sourceTokenIndex: token.index,
        isNumeric: token.isNumeric,
        numericValue: token.numericValue,
      };
      postfixOutput.push(item);

      steps.push({
        stepIndex: stepCount++,
        action: 'read_operand',
        currentTokenIndex: i,
        currentToken: token,
        operatorStack: operatorStack.toArray(),
        postfixOutput: [...postfixOutput],
        explanation: `Token "${token.value}" is an operand. Append directly to postfix output.`,
        ruleApplied: 'Operands bypass the stack and go directly to output',
        outputItem: item,
      });
    } else if (token.type === 'left_paren') {
      const item: StackItem = {
        id: `stack-item-${token.id}`,
        value: '(',
        sourceTokenIndex: token.index,
      };
      operatorStack.push(item);

      steps.push({
        stepIndex: stepCount++,
        action: 'push_paren',
        currentTokenIndex: i,
        currentToken: token,
        operatorStack: operatorStack.toArray(),
        postfixOutput: [...postfixOutput],
        explanation: `Left parenthesis "(" encountered. Push onto operator stack to begin sub-expression.`,
        ruleApplied: `'(' has lowest precedence inside stack and awaits matching ')'`,
        pushingItem: item,
      });
    } else if (token.type === 'right_paren') {
      // Pop until matching left parenthesis
      while (!operatorStack.isEmpty() && operatorStack.peek()!.value !== '(') {
        const popped = operatorStack.pop()!;
        const outItem: StackItem = {
          id: `postfix-item-${popped.id}`,
          value: popped.value,
          sourceTokenIndex: popped.sourceTokenIndex,
        };
        postfixOutput.push(outItem);

        steps.push({
          stepIndex: stepCount++,
          action: 'pop_until_left_paren',
          currentTokenIndex: i,
          currentToken: token,
          operatorStack: operatorStack.toArray(),
          postfixOutput: [...postfixOutput],
          explanation: `Right parenthesis ")". Pop operator "${popped.value}" from stack to postfix output.`,
          ruleApplied: 'Pop all operators inside parentheses until "(" is reached',
          poppingItem: popped,
          outputItem: outItem,
        });
      }

      // Pop and discard the left parenthesis
      if (!operatorStack.isEmpty() && operatorStack.peek()!.value === '(') {
        const discardedParen = operatorStack.pop()!;
        steps.push({
          stepIndex: stepCount++,
          action: 'discard_left_paren',
          currentTokenIndex: i,
          currentToken: token,
          operatorStack: operatorStack.toArray(),
          postfixOutput: [...postfixOutput],
          explanation: `Matching "(" found on operator stack. Pop and discard both parentheses.`,
          ruleApplied: 'Parentheses are never included in the postfix output',
          poppingItem: discardedParen,
        });
      }
    } else if (token.type === 'operator') {
      const incomingOp = token.value;
      const incomingPrec = getPrecedence(incomingOp);
      const incomingAssoc = getAssociativity(incomingOp);

      // Pop operators of higher or equal precedence (left-associative)
      while (!operatorStack.isEmpty()) {
        const top = operatorStack.peek()!;
        if (top.value === '(') break;

        const topPrec = getPrecedence(top.value);

        const shouldPop =
          topPrec > incomingPrec ||
          (topPrec === incomingPrec && incomingAssoc === 'left');

        if (shouldPop) {
          const popped = operatorStack.pop()!;
          const outItem: StackItem = {
            id: `postfix-item-${popped.id}`,
            value: popped.value,
            sourceTokenIndex: popped.sourceTokenIndex,
          };
          postfixOutput.push(outItem);

          steps.push({
            stepIndex: stepCount++,
            action: 'pop_higher_precedence',
            currentTokenIndex: i,
            currentToken: token,
            operatorStack: operatorStack.toArray(),
            postfixOutput: [...postfixOutput],
            explanation: `Top of stack "${top.value}" (precedence ${topPrec}) >= incoming "${incomingOp}" (precedence ${incomingPrec}). Pop "${top.value}" to output.`,
            ruleApplied: 'Operators of higher or equal precedence execute before incoming operator',
            poppingItem: popped,
            outputItem: outItem,
            comparison: {
              incomingOp,
              incomingPrec,
              topOp: top.value,
              topPrec,
              decision: `Pop "${top.value}" to output`,
            },
          });
        } else {
          break;
        }
      }

      // Push incoming operator onto stack
      const stackOpItem: StackItem = {
        id: `stack-item-${token.id}`,
        value: incomingOp,
        sourceTokenIndex: token.index,
      };
      operatorStack.push(stackOpItem);

      steps.push({
        stepIndex: stepCount++,
        action: 'push_operator',
        currentTokenIndex: i,
        currentToken: token,
        operatorStack: operatorStack.toArray(),
        postfixOutput: [...postfixOutput],
        explanation: `Push operator "${incomingOp}" (precedence ${incomingPrec}) onto operator stack.`,
        ruleApplied: 'Push operator onto stack to await higher precedence or operand',
        pushingItem: stackOpItem,
      });
    }
  }

  // Pop remaining operators from stack
  while (!operatorStack.isEmpty()) {
    const popped = operatorStack.pop()!;
    const outItem: StackItem = {
      id: `postfix-item-${popped.id}`,
      value: popped.value,
      sourceTokenIndex: popped.sourceTokenIndex,
    };
    postfixOutput.push(outItem);

    steps.push({
      stepIndex: stepCount++,
      action: 'pop_remaining',
      currentTokenIndex: tokens.length - 1,
      currentToken: null,
      operatorStack: operatorStack.toArray(),
      postfixOutput: [...postfixOutput],
      explanation: `End of expression reached. Pop remaining operator "${popped.value}" from stack to postfix output.`,
      ruleApplied: 'Empty remaining operators on stack into output in LIFO order',
      poppingItem: popped,
      outputItem: outItem,
    });
  }

  const finalPostfix = postfixOutput.map((item) => item.value).join(' ');

  // Create postfix tokens list for evaluation
  const finalPostfixTokens: Token[] = postfixOutput.map((item, idx) => ({
    id: `eval-token-${idx}-${item.value}`,
    value: item.value,
    type: isOperator(item.value) ? 'operator' : 'operand',
    index: idx,
    isNumeric: item.isNumeric,
    numericValue: item.numericValue,
  }));

  // Step complete
  steps.push({
    stepIndex: stepCount++,
    action: 'complete',
    currentTokenIndex: -1,
    currentToken: null,
    operatorStack: [],
    postfixOutput: [...postfixOutput],
    explanation: `Conversion complete! Postfix expression: "${finalPostfix}"`,
    ruleApplied: 'All tokens processed and stack is cleared',
  });

  return {
    tokens,
    steps,
    finalPostfix,
    finalPostfixTokens,
    isValid: true,
  };
}
