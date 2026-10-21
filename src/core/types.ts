export type TokenType = 'operand' | 'operator' | 'left_paren' | 'right_paren';

export type Associativity = 'left' | 'right';

export interface Token {
  id: string; // unique ID for React / Motion keying
  value: string;
  type: TokenType;
  index: number; // original index/position in expression
  isNumeric?: boolean;
  numericValue?: number;
}

export interface OperatorInfo {
  precedence: number;
  associativity: Associativity;
  symbol: string;
}

export interface StackItem {
  id: string;
  value: string;
  sourceTokenIndex?: number;
  isNumeric?: boolean;
  numericValue?: number;
  label?: string; // Optional role descriptor like 'Left operand', 'Right operand'
}

export type InfixActionType =
  | 'idle'
  | 'start'
  | 'read_operand'
  | 'read_operator'
  | 'read_left_paren'
  | 'read_right_paren'
  | 'push_operator'
  | 'push_paren'
  | 'pop_higher_precedence'
  | 'pop_until_left_paren'
  | 'discard_left_paren'
  | 'pop_remaining'
  | 'complete'
  | 'error';

export interface InfixStep {
  stepIndex: number;
  action: InfixActionType;
  currentTokenIndex: number; // Index in tokens array, -1 if none
  currentToken: Token | null;
  operatorStack: StackItem[]; // Current state of the stack (bottom to top)
  postfixOutput: StackItem[]; // Current postfix output (left to right)
  explanation: string;
  ruleApplied: string;
  
  // Specific animation visual cues:
  poppingItem?: StackItem | null; // Item actively being popped from stack
  pushingItem?: StackItem | null; // Item actively being pushed onto stack
  outputItem?: StackItem | null;  // Item actively arriving at postfix output
  highlightStackTop?: boolean;    // Highlight stack top for precedence comparison
  comparison?: {
    incomingOp: string;
    incomingPrec: number;
    topOp: string;
    topPrec: number;
    decision: string;
  } | null;
  error?: string;
}

export type EvalActionType =
  | 'idle'
  | 'start'
  | 'read_operand'
  | 'push_operand'
  | 'read_operator'
  | 'pop_operands'
  | 'evaluating'
  | 'push_result'
  | 'complete'
  | 'error';

export interface EvalStep {
  stepIndex: number;
  action: EvalActionType;
  currentTokenIndex: number; // Index in postfix tokens array
  currentToken: Token | null;
  evalStack: StackItem[]; // Stack state (bottom to top)
  explanation: string;
  
  // Animation cues for postfix evaluation:
  poppedOperands?: {
    left: StackItem;
    right: StackItem;
    operator: string;
  } | null;
  activeCalculation?: {
    leftVal: number;
    rightVal: number;
    operator: string;
    result: number;
    formula: string;
  } | null;
  pushingResult?: StackItem | null;
  highlightStackIndices?: number[];
  finalResult?: number | null;
  error?: string;
}

export interface TraceResult {
  tokens: Token[];
  steps: InfixStep[];
  finalPostfix: string;
  finalPostfixTokens: Token[];
  isValid: boolean;
  errorMessage?: string;
}

export interface EvalTraceResult {
  tokens: Token[];
  steps: EvalStep[];
  finalResult: number | null;
  isValid: boolean;
  errorMessage?: string;
}
