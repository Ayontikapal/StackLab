import { describe, it, expect } from 'vitest';
import { Stack } from '../stack';
import { tokenizeInfix } from '../tokenizer';
import { generateInfixToPostfixTrace } from '../infixToPostfix';
import { generatePostfixEvalTrace } from '../postfixEvaluator';

describe('Stack data structure', () => {
  it('correctly handles push, pop, peek, size, isEmpty', () => {
    const stack = new Stack<number>();
    expect(stack.isEmpty()).toBe(true);
    expect(stack.size()).toBe(0);
    expect(stack.peek()).toBeUndefined();
    expect(stack.pop()).toBeUndefined();

    stack.push(10);
    stack.push(20);
    expect(stack.size()).toBe(2);
    expect(stack.peek()).toBe(20);
    expect(stack.toArray()).toEqual([10, 20]);

    const popped = stack.pop();
    expect(popped).toBe(20);
    expect(stack.size()).toBe(1);
    expect(stack.peek()).toBe(10);

    stack.clear();
    expect(stack.isEmpty()).toBe(true);
  });
});

describe('Tokenizer & Validation', () => {
  it('tokenizes standard arithmetic expression "2 + 3 * 4"', () => {
    const res = tokenizeInfix('2 + 3 * 4');
    expect(res.isValid).toBe(true);
    expect(res.tokens.map((t) => t.value)).toEqual(['2', '+', '3', '*', '4']);
  });

  it('detects mismatched parentheses', () => {
    const res = tokenizeInfix('(2 + 3');
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('Mismatched parentheses');
  });

  it('detects consecutive operators', () => {
    const res = tokenizeInfix('2 + * 3');
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('Consecutive operators');
  });

  it('rejects starting or ending with operators', () => {
    expect(tokenizeInfix('* 5 + 2').isValid).toBe(false);
    expect(tokenizeInfix('5 + 2 -').isValid).toBe(false);
  });
});

describe('Infix to Postfix Converter Trace', () => {
  it('converts acceptance test expression "2 + 3 * 4" to "2 3 4 * +" with accurate steps', () => {
    const result = generateInfixToPostfixTrace('2 + 3 * 4');
    expect(result.isValid).toBe(true);
    expect(result.finalPostfix).toBe('2 3 4 * +');

    // Step verification
    const steps = result.steps;
    expect(steps.length).toBeGreaterThan(5);

    // Initial step
    expect(steps[0].action).toBe('start');
    expect(steps[0].operatorStack).toEqual([]);
    expect(steps[0].postfixOutput).toEqual([]);

    // Final step
    const lastStep = steps[steps.length - 1];
    expect(lastStep.action).toBe('complete');
    expect(lastStep.operatorStack).toEqual([]);
    expect(lastStep.postfixOutput.map((i) => i.value)).toEqual(['2', '3', '4', '*', '+']);

    // Check that operand 2 entered output
    const op2Step = steps.find((s) => s.action === 'read_operand' && s.currentToken?.value === '2');
    expect(op2Step).toBeDefined();

    // Check operator + was pushed
    const plusStep = steps.find((s) => s.action === 'push_operator' && s.currentToken?.value === '+');
    expect(plusStep).toBeDefined();
    expect(plusStep?.operatorStack.map((i) => i.value)).toEqual(['+']);

    // Check operator * was pushed above +
    const mulStep = steps.find((s) => s.action === 'push_operator' && s.currentToken?.value === '*');
    expect(mulStep).toBeDefined();
    expect(mulStep?.operatorStack.map((i) => i.value)).toEqual(['+', '*']);

    // Check remaining operators popped in reverse order (* then +)
    const popRemainingSteps = steps.filter((s) => s.action === 'pop_remaining');
    expect(popRemainingSteps.length).toBe(2);
    expect(popRemainingSteps[0].poppingItem?.value).toBe('*');
    expect(popRemainingSteps[1].poppingItem?.value).toBe('+');
  });

  it('correctly handles parenthesized expression "(2 + 3) * 4"', () => {
    const result = generateInfixToPostfixTrace('(2 + 3) * 4');
    expect(result.isValid).toBe(true);
    expect(result.finalPostfix).toBe('2 3 + 4 *');
  });

  it('handles right-associative exponentiation "2 ^ 3 ^ 2"', () => {
    const result = generateInfixToPostfixTrace('2 ^ 3 ^ 2');
    expect(result.isValid).toBe(true);
    expect(result.finalPostfix).toBe('2 3 2 ^ ^');
  });
});

describe('Postfix Expression Evaluator Trace', () => {
  it('evaluates "2 3 4 * +" to 14', () => {
    const infixResult = generateInfixToPostfixTrace('2 + 3 * 4');
    const evalResult = generatePostfixEvalTrace(infixResult.finalPostfixTokens);

    expect(evalResult.isValid).toBe(true);
    expect(evalResult.finalResult).toBe(14);

    // Verify pop two operands and push result occurred
    const popSteps = evalResult.steps.filter((s) => s.action === 'pop_operands');
    expect(popSteps.length).toBe(2); // for * and +

    const calcSteps = evalResult.steps.filter((s) => s.action === 'evaluating');
    expect(calcSteps.length).toBe(2);
    expect(calcSteps[0].activeCalculation?.formula).toBe('3 * 4 = 12');
    expect(calcSteps[1].activeCalculation?.formula).toBe('2 + 12 = 14');
  });

  it('correctly reports division by zero', () => {
    const infix = generateInfixToPostfixTrace('10 / (5 - 5)');
    const evalResult = generatePostfixEvalTrace(infix.finalPostfixTokens);
    expect(evalResult.isValid).toBe(false);
    expect(evalResult.errorMessage).toContain('Division by zero');
  });

  it('reports when variables are present in evaluation', () => {
    const infix = generateInfixToPostfixTrace('A + B');
    const evalResult = generatePostfixEvalTrace(infix.finalPostfixTokens);
    expect(evalResult.isValid).toBe(false);
    expect(evalResult.errorMessage).toContain('Evaluation requires numbers');
  });
});
