import { describe, it, expect } from 'vitest';
import { generateInfixToPostfixTrace } from '../infixToPostfix';
import { generatePostfixEvalTrace } from '../postfixEvaluator';

describe('Acceptance Criterion: Infix to Postfix "2 + 3 * 4"', () => {
  it('updates stack, output, current token, and explanation correctly at every step', () => {
    const trace = generateInfixToPostfixTrace('2 + 3 * 4');
    expect(trace.isValid).toBe(true);

    const steps = trace.steps;
    expect(steps.length).toBe(9);

    // Step 0: Initial Start
    expect(steps[0].action).toBe('start');
    expect(steps[0].operatorStack).toEqual([]);
    expect(steps[0].postfixOutput).toEqual([]);
    expect(steps[0].currentToken).toBeNull();
    expect(steps[0].explanation).toContain('Starting Infix to Postfix conversion');

    // Step 1: Read '2' (Operand)
    expect(steps[1].action).toBe('read_operand');
    expect(steps[1].currentToken?.value).toBe('2');
    expect(steps[1].operatorStack.map((i) => i.value)).toEqual([]);
    expect(steps[1].postfixOutput.map((i) => i.value)).toEqual(['2']);
    expect(steps[1].explanation).toContain('Token "2" is an operand. Append directly to postfix output.');

    // Step 2: Push '+' (Operator onto empty stack)
    expect(steps[2].action).toBe('push_operator');
    expect(steps[2].currentToken?.value).toBe('+');
    expect(steps[2].operatorStack.map((i) => i.value)).toEqual(['+']);
    expect(steps[2].postfixOutput.map((i) => i.value)).toEqual(['2']);
    expect(steps[2].pushingItem?.value).toBe('+');
    expect(steps[2].explanation).toContain('Push operator "+"');

    // Step 3: Read '3' (Operand)
    expect(steps[3].action).toBe('read_operand');
    expect(steps[3].currentToken?.value).toBe('3');
    expect(steps[3].operatorStack.map((i) => i.value)).toEqual(['+']);
    expect(steps[3].postfixOutput.map((i) => i.value)).toEqual(['2', '3']);
    expect(steps[3].explanation).toContain('Token "3" is an operand.');

    // Step 4: Push '*' (Operator with higher precedence than '+')
    expect(steps[4].action).toBe('push_operator');
    expect(steps[4].currentToken?.value).toBe('*');
    expect(steps[4].operatorStack.map((i) => i.value)).toEqual(['+', '*']);
    expect(steps[4].postfixOutput.map((i) => i.value)).toEqual(['2', '3']);
    expect(steps[4].pushingItem?.value).toBe('*');
    expect(steps[4].explanation).toContain('Push operator "*"');

    // Step 5: Read '4' (Operand)
    expect(steps[5].action).toBe('read_operand');
    expect(steps[5].currentToken?.value).toBe('4');
    expect(steps[5].operatorStack.map((i) => i.value)).toEqual(['+', '*']);
    expect(steps[5].postfixOutput.map((i) => i.value)).toEqual(['2', '3', '4']);
    expect(steps[5].explanation).toContain('Token "4" is an operand.');

    // Step 6: Pop '*' remaining on stack
    expect(steps[6].action).toBe('pop_remaining');
    expect(steps[6].poppingItem?.value).toBe('*');
    expect(steps[6].operatorStack.map((i) => i.value)).toEqual(['+']);
    expect(steps[6].postfixOutput.map((i) => i.value)).toEqual(['2', '3', '4', '*']);
    expect(steps[6].explanation).toContain('Pop remaining operator "*" from stack to postfix output.');

    // Step 7: Pop '+' remaining on stack
    expect(steps[7].action).toBe('pop_remaining');
    expect(steps[7].poppingItem?.value).toBe('+');
    expect(steps[7].operatorStack.map((i) => i.value)).toEqual([]);
    expect(steps[7].postfixOutput.map((i) => i.value)).toEqual(['2', '3', '4', '*', '+']);
    expect(steps[7].explanation).toContain('Pop remaining operator "+" from stack to postfix output.');

    // Step 8: Complete
    expect(steps[8].action).toBe('complete');
    expect(steps[8].operatorStack).toEqual([]);
    expect(steps[8].postfixOutput.map((i) => i.value)).toEqual(['2', '3', '4', '*', '+']);
    expect(steps[8].explanation).toContain('Conversion complete! Postfix expression: "2 3 4 * +"');
  });

  it('evaluates postfix "2 3 4 * +" through actual ALU step operations to 14', () => {
    const trace = generateInfixToPostfixTrace('2 + 3 * 4');
    const evalTrace = generatePostfixEvalTrace(trace.finalPostfixTokens);

    expect(evalTrace.isValid).toBe(true);
    expect(evalTrace.finalResult).toBe(14);

    const steps = evalTrace.steps;

    // Pop operands for '*'
    const mulPopStep = steps.find((s) => s.action === 'pop_operands' && s.poppedOperands?.operator === '*');
    expect(mulPopStep).toBeDefined();
    expect(mulPopStep?.poppedOperands?.left.value).toBe('3');
    expect(mulPopStep?.poppedOperands?.right.value).toBe('4');

    // Computing 3 * 4 = 12
    const mulCalcStep = steps.find((s) => s.action === 'evaluating' && s.activeCalculation?.formula === '3 * 4 = 12');
    expect(mulCalcStep).toBeDefined();
    expect(mulCalcStep?.activeCalculation?.result).toBe(12);

    // Pop operands for '+'
    const addPopStep = steps.find((s) => s.action === 'pop_operands' && s.poppedOperands?.operator === '+');
    expect(addPopStep).toBeDefined();
    expect(addPopStep?.poppedOperands?.left.value).toBe('2');
    expect(addPopStep?.poppedOperands?.right.value).toBe('12');

    // Final result step
    const finalStep = steps[steps.length - 1];
    expect(finalStep.action).toBe('complete');
    expect(finalStep.finalResult).toBe(14);
  });
});
