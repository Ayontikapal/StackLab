export type SupportedLanguage = 'typescript' | 'python' | 'cpp' | 'java' | 'c';
export type SnippetView = 'full' | 'stack' | 'algorithm';

export interface CodeSnippetSet {
  full: string;
  stack: string;
  algorithm: string;
}

export interface LanguageMeta {
  id: SupportedLanguage;
  name: string;
  badge: string;
  extension: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { id: 'typescript', name: 'TypeScript', badge: 'TS', extension: '.ts' },
  { id: 'python', name: 'Python', badge: 'PY', extension: '.py' },
  { id: 'cpp', name: 'C++', badge: 'C++', extension: '.cpp' },
  { id: 'java', name: 'Java', badge: 'JAVA', extension: '.java' },
  { id: 'c', name: 'C', badge: 'C', extension: '.c' },
];

export const CONVERTER_SNIPPETS: Record<SupportedLanguage, CodeSnippetSet> = {
  typescript: {
    stack: `/**
 * Singly Linked List Stack Implementation (LIFO)
 */
class StackNode<T> {
  value: T;
  next: StackNode<T> | null = null;

  constructor(value: T, next: StackNode<T> | null = null) {
    this.value = value;
    this.next = next;
  }
}

export class LinkedListStack<T> {
  private topNode: StackNode<T> | null = null;
  private count: number = 0;

  // Push element onto top of stack: O(1)
  push(item: T): void {
    const newNode = new StackNode<T>(item, this.topNode);
    this.topNode = newNode;
    this.count++;
  }

  // Remove and return top element: O(1)
  pop(): T | undefined {
    if (!this.topNode) return undefined;
    const popped = this.topNode.value;
    this.topNode = this.topNode.next;
    this.count--;
    return popped;
  }

  // Look at top element without removing: O(1)
  peek(): T | undefined {
    return this.topNode ? this.topNode.value : undefined;
  }

  isEmpty(): boolean {
    return this.topNode === null;
  }

  size(): number {
    return this.count;
  }
}`,
    algorithm: `/**
 * Converts Infix Expression to Postfix (RPN) using Dijkstra's Shunting-Yard
 */
export function infixToPostfix(expression: string): string {
  const precedence: Record<string, number> = {
    '+': 1, '-': 1,
    '*': 2, '/': 2, '%': 2,
    '^': 3,
  };

  // Instantiate our Linked List Stack for operators
  const operatorStack = new LinkedListStack<string>();
  const output: string[] = [];

  // Match numbers, variable identifiers, and operator/parenthesis symbols
  const tokens = expression.match(/\\d+|[a-zA-Z]+|[+\\-*/%^()]|[^\\s]/g) || [];

  for (const token of tokens) {
    if (/^[0-9a-zA-Z]+$/.test(token)) {
      // Operands bypass stack directly to output stream
      output.push(token);
    } else if (token === '(') {
      operatorStack.push(token);
    } else if (token === ')') {
      // Pop operators until matching left parenthesis
      while (!operatorStack.isEmpty() && operatorStack.peek() !== '(') {
        output.push(operatorStack.pop()!);
      }
      operatorStack.pop(); // Discard '(' from stack
    } else {
      // Operator encountered: pop higher or equal precedence operators
      while (
        !operatorStack.isEmpty() &&
        operatorStack.peek() !== '(' &&
        (precedence[operatorStack.peek()!] || 0) >= (precedence[token] || 0)
      ) {
        output.push(operatorStack.pop()!);
      }
      operatorStack.push(token);
    }
  }

  // Flush remaining operators from the linked list stack
  while (!operatorStack.isEmpty()) {
    output.push(operatorStack.pop()!);
  }

  return output.join(' ');
}`,
    full: `// ==========================================
// Infix to Postfix Converter with Linked List Stack
// ==========================================

// 1. Singly Linked List Node
class StackNode<T> {
  value: T;
  next: StackNode<T> | null = null;

  constructor(value: T, next: StackNode<T> | null = null) {
    this.value = value;
    this.next = next;
  }
}

// 2. Generic Linked List Stack (LIFO)
class LinkedListStack<T> {
  private topNode: StackNode<T> | null = null;
  private count: number = 0;

  push(item: T): void {
    const newNode = new StackNode<T>(item, this.topNode);
    this.topNode = newNode;
    this.count++;
  }

  pop(): T | undefined {
    if (!this.topNode) return undefined;
    const popped = this.topNode.value;
    this.topNode = this.topNode.next;
    this.count--;
    return popped;
  }

  peek(): T | undefined {
    return this.topNode ? this.topNode.value : undefined;
  }

  isEmpty(): boolean {
    return this.topNode === null;
  }

  size(): number {
    return this.count;
  }
}

// 3. Shunting-Yard Infix to Postfix Algorithm
export function infixToPostfix(expression: string): string {
  const precedence: Record<string, number> = {
    '+': 1, '-': 1,
    '*': 2, '/': 2, '%': 2,
    '^': 3,
  };

  const operatorStack = new LinkedListStack<string>();
  const output: string[] = [];
  const tokens = expression.match(/\\d+|[a-zA-Z]+|[+\\-*/%^()]|[^\\s]/g) || [];

  for (const token of tokens) {
    if (/^[0-9a-zA-Z]+$/.test(token)) {
      output.push(token);
    } else if (token === '(') {
      operatorStack.push(token);
    } else if (token === ')') {
      while (!operatorStack.isEmpty() && operatorStack.peek() !== '(') {
        output.push(operatorStack.pop()!);
      }
      operatorStack.pop(); // Discard '('
    } else {
      while (
        !operatorStack.isEmpty() &&
        operatorStack.peek() !== '(' &&
        (precedence[operatorStack.peek()!] || 0) >= (precedence[token] || 0)
      ) {
        output.push(operatorStack.pop()!);
      }
      operatorStack.push(token);
    }
  }

  while (!operatorStack.isEmpty()) {
    output.push(operatorStack.pop()!);
  }

  return output.join(' ');
}

// Example Execution:
// console.log(infixToPostfix("2 + 3 * 4")); // Output: "2 3 4 * +"`,
  },

  python: {
    stack: `"""
Linked List Stack Implementation in Python (LIFO)
"""
class StackNode:
    def __init__(self, value, next_node=None):
        self.value = value
        self.next = next_node

class LinkedListStack:
    def __init__(self):
        self.top_node = None
        self._size = 0

    # O(1) Push
    def push(self, item):
        new_node = StackNode(item, self.top_node)
        self.top_node = new_node
        self._size += 1

    # O(1) Pop
    def pop(self):
        if self.is_empty():
            return None
        val = self.top_node.value
        self.top_node = self.top_node.next
        self._size -= 1
        return val

    # O(1) Peek
    def peek(self):
        return self.top_node.value if self.top_node else None

    def is_empty(self):
        return self.top_node is None

    def size(self):
        return self._size`,
    algorithm: `def infix_to_postfix(expression: str) -> str:
    precedence = {'+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3}
    operator_stack = LinkedListStack()
    output = []

    tokens = expression.replace('(', ' ( ').replace(')', ' ) ').split()

    for token in tokens:
        if token.isalnum():
            # Operands bypass stack directly to output
            output.append(token)
        elif token == '(':
            operator_stack.push(token)
        elif token == ')':
            while not operator_stack.is_empty() and operator_stack.peek() != '(':
                output.append(operator_stack.pop())
            operator_stack.pop() # Discard '('
        else: # Operator
            while (not operator_stack.is_empty() and 
                   operator_stack.peek() != '(' and
                   precedence.get(operator_stack.peek(), 0) >= precedence.get(token, 0)):
                output.append(operator_stack.pop())
            operator_stack.push(token)

    while not operator_stack.is_empty():
        output.append(operator_stack.pop())

    return ' '.join(output)`,
    full: `# ==========================================
# Infix to Postfix Converter with Linked List Stack (Python)
# ==========================================

class StackNode:
    def __init__(self, value, next_node=None):
        self.value = value
        self.next = next_node

class LinkedListStack:
    def __init__(self):
        self.top_node = None
        self._size = 0

    def push(self, item):
        new_node = StackNode(item, self.top_node)
        self.top_node = new_node
        self._size += 1

    def pop(self):
        if self.is_empty():
            return None
        val = self.top_node.value
        self.top_node = self.top_node.next
        self._size -= 1
        return val

    def peek(self):
        return self.top_node.value if self.top_node else None

    def is_empty(self):
        return self.top_node is None

    def size(self):
        return self._size

def infix_to_postfix(expression: str) -> str:
    precedence = {'+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3}
    operator_stack = LinkedListStack()
    output = []

    tokens = expression.replace('(', ' ( ').replace(')', ' ) ').split()

    for token in tokens:
        if token.isalnum():
            output.append(token)
        elif token == '(':
            operator_stack.push(token)
        elif token == ')':
            while not operator_stack.is_empty() and operator_stack.peek() != '(':
                output.append(operator_stack.pop())
            operator_stack.pop()
        else:
            while (not operator_stack.is_empty() and 
                   operator_stack.peek() != '(' and
                   precedence.get(operator_stack.peek(), 0) >= precedence.get(token, 0)):
                output.append(operator_stack.pop())
            operator_stack.push(token)

    while not operator_stack.is_empty():
        output.append(operator_stack.pop())

    return ' '.join(output)

if __name__ == '__main__':
    expr = "2 + 3 * 4"
    print("Infix:  ", expr)
    print("Postfix:", infix_to_postfix(expr)) # Output: 2 3 4 * +`,
  },

  cpp: {
    stack: `// Singly Linked List Stack Implementation in C++
#include <iostream>
#include <stdexcept>

template <typename T>
struct StackNode {
    T value;
    StackNode* next;
    StackNode(T val, StackNode* n = nullptr) : value(val), next(n) {}
};

template <typename T>
class LinkedListStack {
private:
    StackNode<T>* topNode;
    size_t count;

public:
    LinkedListStack() : topNode(nullptr), count(0) {}

    ~LinkedListStack() {
        while (!isEmpty()) pop();
    }

    void push(T item) {
        topNode = new StackNode<T>(item, topNode);
        count++;
    }

    T pop() {
        if (isEmpty()) throw std::underflow_error("Stack is empty");
        StackNode<T>* temp = topNode;
        T val = temp->value;
        topNode = topNode->next;
        delete temp;
        count--;
        return val;
    }

    T peek() const {
        if (isEmpty()) throw std::underflow_error("Stack is empty");
        return topNode->value;
    }

    bool isEmpty() const { return topNode == nullptr; }
    size_t size() const { return count; }
};`,
    algorithm: `int precedence(char op) {
    if (op == '^') return 3;
    if (op == '*' || op == '/' || op == '%') return 2;
    if (op == '+' || op == '-') return 1;
    return 0;
}

std::string infixToPostfix(const std::string& expr) {
    LinkedListStack<char> operatorStack;
    std::string result = "";

    for (char c : expr) {
        if (isspace(c)) continue;
        if (isalnum(c)) {
            result += c;
            result += ' ';
        } else if (c == '(') {
            operatorStack.push(c);
        } else if (c == ')') {
            while (!operatorStack.isEmpty() && operatorStack.peek() != '(') {
                result += operatorStack.pop();
                result += ' ';
            }
            if (!operatorStack.isEmpty()) operatorStack.pop(); // Discard '('
        } else {
            while (!operatorStack.isEmpty() && operatorStack.peek() != '(' &&
                   precedence(operatorStack.peek()) >= precedence(c)) {
                result += operatorStack.pop();
                result += ' ';
            }
            operatorStack.push(c);
        }
    }

    while (!operatorStack.isEmpty()) {
        result += operatorStack.pop();
        result += ' ';
    }
    return result;
}`,
    full: `#include <iostream>
#include <string>
#include <cctype>
#include <stdexcept>

template <typename T>
struct StackNode {
    T value;
    StackNode* next;
    StackNode(T val, StackNode* n = nullptr) : value(val), next(n) {}
};

template <typename T>
class LinkedListStack {
private:
    StackNode<T>* topNode;
    size_t count;

public:
    LinkedListStack() : topNode(nullptr), count(0) {}
    ~LinkedListStack() { while (!isEmpty()) pop(); }

    void push(T item) {
        topNode = new StackNode<T>(item, topNode);
        count++;
    }

    T pop() {
        if (isEmpty()) throw std::underflow_error("Stack is empty");
        StackNode<T>* temp = topNode;
        T val = temp->value;
        topNode = topNode->next;
        delete temp;
        count--;
        return val;
    }

    T peek() const {
        if (isEmpty()) throw std::underflow_error("Stack is empty");
        return topNode->value;
    }

    bool isEmpty() const { return topNode == nullptr; }
    size_t size() const { return count; }
};

int precedence(char op) {
    if (op == '^') return 3;
    if (op == '*' || op == '/' || op == '%') return 2;
    if (op == '+' || op == '-') return 1;
    return 0;
}

std::string infixToPostfix(const std::string& expr) {
    LinkedListStack<char> operatorStack;
    std::string result = "";

    for (char c : expr) {
        if (isspace(c)) continue;
        if (isalnum(c)) {
            result += c; result += ' ';
        } else if (c == '(') {
            operatorStack.push(c);
        } else if (c == ')') {
            while (!operatorStack.isEmpty() && operatorStack.peek() != '(') {
                result += operatorStack.pop(); result += ' ';
            }
            if (!operatorStack.isEmpty()) operatorStack.pop();
        } else {
            while (!operatorStack.isEmpty() && operatorStack.peek() != '(' &&
                   precedence(operatorStack.peek()) >= precedence(c)) {
                result += operatorStack.pop(); result += ' ';
            }
            operatorStack.push(c);
        }
    }
    while (!operatorStack.isEmpty()) {
        result += operatorStack.pop(); result += ' ';
    }
    return result;
}

int main() {
    std::string infix = "2 + 3 * 4";
    std::cout << "Postfix: " << infixToPostfix(infix) << std::endl;
    return 0;
}`,
  },

  java: {
    stack: `// Generic Singly Linked List Stack Implementation in Java
class StackNode<T> {
    T value;
    StackNode<T> next;

    StackNode(T value, StackNode<T> next) {
        this.value = value;
        this.next = next;
    }
}

public class LinkedListStack<T> {
    private StackNode<T> topNode = null;
    private int count = 0;

    public void push(T item) {
        this.topNode = new StackNode<>(item, this.topNode);
        this.count++;
    }

    public T pop() {
        if (isEmpty()) return null;
        T val = this.topNode.value;
        this.topNode = this.topNode.next;
        this.count--;
        return val;
    }

    public T peek() {
        return isEmpty() ? null : this.topNode.value;
    }

    public boolean isEmpty() {
        return this.topNode == null;
    }

    public int size() {
        return this.count;
    }
}`,
    algorithm: `public static int precedence(char ch) {
    switch (ch) {
        case '+': case '-': return 1;
        case '*': case '/': case '%': return 2;
        case '^': return 3;
    }
    return -1;
}

public static String infixToPostfix(String exp) {
    StringBuilder result = new StringBuilder();
    LinkedListStack<Character> stack = new LinkedListStack<>();

    for (int i = 0; i < exp.length(); ++i) {
        char c = exp.charAt(i);
        if (Character.isWhitespace(c)) continue;

        if (Character.isLetterOrDigit(c)) {
            result.append(c).append(" ");
        } else if (c == '(') {
            stack.push(c);
        } else if (c == ')') {
            while (!stack.isEmpty() && stack.peek() != '(') {
                result.append(stack.pop()).append(" ");
            }
            stack.pop(); // Discard '('
        } else {
            while (!stack.isEmpty() && stack.peek() != '(' &&
                   precedence(c) <= precedence(stack.peek())) {
                result.append(stack.pop()).append(" ");
            }
            stack.push(c);
        }
    }
    while (!stack.isEmpty()) {
        result.append(stack.pop()).append(" ");
    }
    return result.toString().trim();
}`,
    full: `class StackNode<T> {
    T value;
    StackNode<T> next;
    StackNode(T value, StackNode<T> next) {
        this.value = value;
        this.next = next;
    }
}

class LinkedListStack<T> {
    private StackNode<T> topNode = null;
    private int count = 0;

    public void push(T item) {
        this.topNode = new StackNode<>(item, this.topNode);
        this.count++;
    }

    public T pop() {
        if (isEmpty()) return null;
        T val = this.topNode.value;
        this.topNode = this.topNode.next;
        this.count--;
        return val;
    }

    public T peek() {
        return isEmpty() ? null : this.topNode.value;
    }

    public boolean isEmpty() { return this.topNode == null; }
    public int size() { return this.count; }
}

public class InfixConverter {
    static int precedence(char ch) {
        switch (ch) {
            case '+': case '-': return 1;
            case '*': case '/': case '%': return 2;
            case '^': return 3;
        }
        return -1;
    }

    public static String infixToPostfix(String exp) {
        StringBuilder result = new StringBuilder();
        LinkedListStack<Character> stack = new LinkedListStack<>();

        for (int i = 0; i < exp.length(); ++i) {
            char c = exp.charAt(i);
            if (Character.isWhitespace(c)) continue;

            if (Character.isLetterOrDigit(c)) {
                result.append(c).append(" ");
            } else if (c == '(') {
                stack.push(c);
            } else if (c == ')') {
                while (!stack.isEmpty() && stack.peek() != '(') {
                    result.append(stack.pop()).append(" ");
                }
                stack.pop();
            } else {
                while (!stack.isEmpty() && stack.peek() != '(' &&
                       precedence(c) <= precedence(stack.peek())) {
                    result.append(stack.pop()).append(" ");
                }
                stack.push(c);
            }
        }
        while (!stack.isEmpty()) {
            result.append(stack.pop()).append(" ");
        }
        return result.toString().trim();
    }

    public static void main(String[] args) {
        String infix = "2 + 3 * 4";
        System.out.println("Postfix: " + infixToPostfix(infix));
    }
}`,
  },

  c: {
    stack: `// Singly Linked List Stack in C
#include <stdio.h>
#include <stdlib.h>

typedef struct StackNode {
    char data;
    struct StackNode* next;
} StackNode;

void push(StackNode** top, char val) {
    StackNode* newNode = (StackNode*)malloc(sizeof(StackNode));
    newNode->data = val;
    newNode->next = *top;
    *top = newNode;
}

char pop(StackNode** top) {
    if (*top == NULL) return '\\0';
    StackNode* temp = *top;
    char val = temp->data;
    *top = (*top)->next;
    free(temp);
    return val;
}

char peek(StackNode* top) {
    return (top != NULL) ? top->data : '\\0';
}

int isEmpty(StackNode* top) {
    return top == NULL;
}`,
    algorithm: `int precedence(char op) {
    if (op == '^') return 3;
    if (op == '*' || op == '/' || op == '%') return 2;
    if (op == '+' || op == '-') return 1;
    return 0;
}

void infixToPostfix(const char* infix, char* postfix) {
    StackNode* stack = NULL;
    int k = 0;

    for (int i = 0; infix[i] != '\\0'; i++) {
        char c = infix[i];
        if (isspace(c)) continue;

        if (isalnum(c)) {
            postfix[k++] = c;
            postfix[k++] = ' ';
        } else if (c == '(') {
            push(&stack, c);
        } else if (c == ')') {
            while (!isEmpty(stack) && peek(stack) != '(') {
                postfix[k++] = pop(&stack);
                postfix[k++] = ' ';
            }
            pop(&stack); // Discard '('
        } else {
            while (!isEmpty(stack) && peek(stack) != '(' &&
                   precedence(peek(stack)) >= precedence(c)) {
                postfix[k++] = pop(&stack);
                postfix[k++] = ' ';
            }
            push(&stack, c);
        }
    }
    while (!isEmpty(stack)) {
        postfix[k++] = pop(&stack);
        postfix[k++] = ' ';
    }
    postfix[k > 0 ? k - 1 : 0] = '\\0';
}`,
    full: `#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>

typedef struct StackNode {
    char data;
    struct StackNode* next;
} StackNode;

void push(StackNode** top, char val) {
    StackNode* newNode = (StackNode*)malloc(sizeof(StackNode));
    newNode->data = val;
    newNode->next = *top;
    *top = newNode;
}

char pop(StackNode** top) {
    if (*top == NULL) return '\\0';
    StackNode* temp = *top;
    char val = temp->data;
    *top = (*top)->next;
    free(temp);
    return val;
}

char peek(StackNode* top) {
    return (top != NULL) ? top->data : '\\0';
}

int isEmpty(StackNode* top) {
    return top == NULL;
}

int precedence(char op) {
    if (op == '^') return 3;
    if (op == '*' || op == '/' || op == '%') return 2;
    if (op == '+' || op == '-') return 1;
    return 0;
}

void infixToPostfix(const char* infix, char* postfix) {
    StackNode* stack = NULL;
    int k = 0;

    for (int i = 0; infix[i] != '\\0'; i++) {
        char c = infix[i];
        if (isspace(c)) continue;

        if (isalnum(c)) {
            postfix[k++] = c; postfix[k++] = ' ';
        } else if (c == '(') {
            push(&stack, c);
        } else if (c == ')') {
            while (!isEmpty(stack) && peek(stack) != '(') {
                postfix[k++] = pop(&stack); postfix[k++] = ' ';
            }
            pop(&stack);
        } else {
            while (!isEmpty(stack) && peek(stack) != '(' &&
                   precedence(peek(stack)) >= precedence(c)) {
                postfix[k++] = pop(&stack); postfix[k++] = ' ';
            }
            push(&stack, c);
        }
    }
    while (!isEmpty(stack)) {
        postfix[k++] = pop(&stack); postfix[k++] = ' ';
    }
    postfix[k > 0 ? k - 1 : 0] = '\\0';
}

int main() {
    char infix[] = "2 + 3 * 4";
    char postfix[100];
    infixToPostfix(infix, postfix);
    printf("Postfix: %s\\n", postfix); // 2 3 4 * +
    return 0;
}`,
  },
};

export const EVALUATOR_SNIPPETS: Record<SupportedLanguage, CodeSnippetSet> = {
  typescript: {
    stack: `/**
 * Singly Linked List Stack for Numeric Operands (LIFO)
 */
class StackNode<T> {
  value: T;
  next: StackNode<T> | null = null;
  constructor(value: T, next: StackNode<T> | null = null) {
    this.value = value;
    this.next = next;
  }
}

export class LinkedListStack<T> {
  private topNode: StackNode<T> | null = null;
  private count: number = 0;

  push(item: T): void {
    this.topNode = new StackNode<T>(item, this.topNode);
    this.count++;
  }

  pop(): T | undefined {
    if (!this.topNode) return undefined;
    const val = this.topNode.value;
    this.topNode = this.topNode.next;
    this.count--;
    return val;
  }

  peek(): T | undefined {
    return this.topNode?.value;
  }

  isEmpty(): boolean {
    return this.topNode === null;
  }

  size(): number {
    return this.count;
  }
}`,
    algorithm: `/**
 * Evaluates a Postfix (RPN) mathematical expression using a Linked List Stack
 */
export function evaluatePostfix(postfix: string): number {
  const stack = new LinkedListStack<number>();
  const tokens = postfix.trim().split(/\\s+/);

  for (const token of tokens) {
    if (!isNaN(Number(token))) {
      // Numerical operand: Push onto stack
      stack.push(Number(token));
    } else {
      // Operator: Pop right operand (b) first, then left operand (a)
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) {
        throw new Error(\`Insufficient operands for operator "\${token}"\`);
      }

      let result: number;
      switch (token) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/':
          if (b === 0) throw new Error("Division by zero");
          result = a / b;
          break;
        case '%':
          if (b === 0) throw new Error("Modulo by zero");
          result = a % b;
          break;
        case '^': result = Math.pow(a, b); break;
        default:
          throw new Error(\`Unsupported operator: \${token}\`);
      }
      // Push computation result back onto stack
      stack.push(result);
    }
  }

  const finalResult = stack.pop();
  if (finalResult === undefined || !stack.isEmpty()) {
    throw new Error("Invalid postfix expression format");
  }
  return finalResult;
}`,
    full: `// ==========================================
// Postfix (RPN) Evaluator with Linked List Stack
// ==========================================

class StackNode<T> {
  value: T;
  next: StackNode<T> | null = null;
  constructor(value: T, next: StackNode<T> | null = null) {
    this.value = value;
    this.next = next;
  }
}

class LinkedListStack<T> {
  private topNode: StackNode<T> | null = null;
  private count: number = 0;

  push(item: T): void {
    this.topNode = new StackNode<T>(item, this.topNode);
    this.count++;
  }

  pop(): T | undefined {
    if (!this.topNode) return undefined;
    const val = this.topNode.value;
    this.topNode = this.topNode.next;
    this.count--;
    return val;
  }

  isEmpty(): boolean {
    return this.topNode === null;
  }
}

export function evaluatePostfix(postfix: string): number {
  const stack = new LinkedListStack<number>();
  const tokens = postfix.trim().split(/\\s+/);

  for (const token of tokens) {
    if (!isNaN(Number(token))) {
      stack.push(Number(token));
    } else {
      const b = stack.pop(); // Right operand
      const a = stack.pop(); // Left operand
      if (a === undefined || b === undefined) {
        throw new Error("Malformed expression: stack underflow");
      }

      let res: number;
      switch (token) {
        case '+': res = a + b; break;
        case '-': res = a - b; break;
        case '*': res = a * b; break;
        case '/':
          if (b === 0) throw new Error("Division by zero");
          res = a / b;
          break;
        case '^': res = Math.pow(a, b); break;
        case '%': res = a % b; break;
        default: throw new Error(\`Unknown operator: \${token}\`);
      }
      stack.push(res);
    }
  }

  const finalVal = stack.pop();
  if (finalVal === undefined || !stack.isEmpty()) {
    throw new Error("Malformed expression");
  }
  return finalVal;
}

// Example:
// evaluatePostfix("2 3 4 * +") => 14`,
  },

  python: {
    stack: `class StackNode:
    def __init__(self, value, next_node=None):
        self.value = value
        self.next = next_node

class LinkedListStack:
    def __init__(self):
        self.top_node = None
        self._size = 0

    def push(self, item):
        self.top_node = StackNode(item, self.top_node)
        self._size += 1

    def pop(self):
        if self.is_empty():
            return None
        val = self.top_node.value
        self.top_node = self.top_node.next
        self._size -= 1
        return val

    def is_empty(self):
        return self.top_node is None

    def size(self):
        return self._size`,
    algorithm: `def evaluate_postfix(postfix_expr: str) -> float:
    stack = LinkedListStack()
    tokens = postfix_expr.split()

    for token in tokens:
        # Check if token is numerical
        if token.lstrip('-').replace('.', '', 1).isdigit():
            stack.push(float(token))
        else:
            # Pop operands in LIFO order: right (b) first, then left (a)
            b = stack.pop()
            a = stack.pop()
            if a is None or b is None:
                raise ValueError("Insufficient operands on stack")

            if token == '+':   res = a + b
            elif token == '-': res = a - b
            elif token == '*': res = a * b
            elif token == '/':
                if b == 0: raise ZeroDivisionError("Division by zero")
                res = a / b
            elif token == '%': res = a % b
            elif token == '^': res = a ** b
            else: raise ValueError(f"Unknown operator: {token}")

            stack.push(res)

    result = stack.pop()
    if not stack.is_empty():
        raise ValueError("Malformed postfix expression")
    return result`,
    full: `# ==========================================
# Postfix Evaluation with Linked List Stack (Python)
# ==========================================

class StackNode:
    def __init__(self, value, next_node=None):
        self.value = value
        self.next = next_node

class LinkedListStack:
    def __init__(self):
        self.top_node = None
        self._size = 0

    def push(self, item):
        self.top_node = StackNode(item, self.top_node)
        self._size += 1

    def pop(self):
        if self.is_empty():
            return None
        val = self.top_node.value
        self.top_node = self.top_node.next
        self._size -= 1
        return val

    def is_empty(self):
        return self.top_node is None

def evaluate_postfix(postfix_expr: str) -> float:
    stack = LinkedListStack()
    tokens = postfix_expr.split()

    for token in tokens:
        if token.lstrip('-').replace('.', '', 1).isdigit():
            stack.push(float(token))
        else:
            b = stack.pop() # Right operand
            a = stack.pop() # Left operand
            if a is None or b is None:
                raise ValueError("Insufficient operands on stack")

            if token == '+':   res = a + b
            elif token == '-': res = a - b
            elif token == '*': res = a * b
            elif token == '/':
                if b == 0: raise ZeroDivisionError("Division by zero")
                res = a / b
            elif token == '^': res = a ** b
            elif token == '%': res = a % b
            else: raise ValueError(f"Unsupported operator: {token}")

            stack.push(res)

    res = stack.pop()
    if not stack.is_empty():
        raise ValueError("Malformed expression")
    return res

if __name__ == '__main__':
    expr = "2 3 4 * +"
    print("Expression:", expr)
    print("Result:    ", evaluate_postfix(expr)) # Output: 14.0`,
  },

  cpp: {
    stack: `template <typename T>
struct StackNode {
    T value;
    StackNode* next;
    StackNode(T val, StackNode* n = nullptr) : value(val), next(n) {}
};

template <typename T>
class LinkedListStack {
private:
    StackNode<T>* topNode;
    size_t count;

public:
    LinkedListStack() : topNode(nullptr), count(0) {}
    ~LinkedListStack() { while (!isEmpty()) pop(); }

    void push(T item) {
        topNode = new StackNode<T>(item, topNode);
        count++;
    }

    T pop() {
        if (isEmpty()) throw std::underflow_error("Stack underflow");
        StackNode<T>* temp = topNode;
        T val = temp->value;
        topNode = topNode->next;
        delete temp;
        count--;
        return val;
    }

    bool isEmpty() const { return topNode == nullptr; }
    size_t size() const { return count; }
};`,
    algorithm: `double evaluatePostfix(const std::string& postfix) {
    LinkedListStack<double> stack;
    std::stringstream ss(postfix);
    std::string token;

    while (ss >> token) {
        if (isdigit(token[0]) || (token.size() > 1 && token[0] == '-')) {
            stack.push(std::stod(token));
        } else {
            double b = stack.pop(); // Right operand
            double a = stack.pop(); // Left operand
            char op = token[0];

            if (op == '+') stack.push(a + b);
            else if (op == '-') stack.push(a - b);
            else if (op == '*') stack.push(a * b);
            else if (op == '/') {
                if (b == 0.0) throw std::runtime_error("Division by zero");
                stack.push(a / b);
            }
            else if (op == '^') stack.push(std::pow(a, b));
        }
    }
    return stack.pop();
}`,
    full: `#include <iostream>
#include <string>
#include <sstream>
#include <cmath>
#include <stdexcept>

template <typename T>
struct StackNode {
    T value;
    StackNode* next;
    StackNode(T val, StackNode* n = nullptr) : value(val), next(n) {}
};

template <typename T>
class LinkedListStack {
private:
    StackNode<T>* topNode;

public:
    LinkedListStack() : topNode(nullptr) {}
    ~LinkedListStack() { while (!isEmpty()) pop(); }

    void push(T item) {
        topNode = new StackNode<T>(item, topNode);
    }

    T pop() {
        if (isEmpty()) throw std::underflow_error("Stack is empty");
        StackNode<T>* temp = topNode;
        T val = temp->value;
        topNode = topNode->next;
        delete temp;
        return val;
    }

    bool isEmpty() const { return topNode == nullptr; }
};

double evaluatePostfix(const std::string& postfix) {
    LinkedListStack<double> stack;
    std::stringstream ss(postfix);
    std::string token;

    while (ss >> token) {
        if (isdigit(token[0]) || (token.size() > 1 && token[0] == '-')) {
            stack.push(std::stod(token));
        } else {
            double b = stack.pop();
            double a = stack.pop();
            char op = token[0];

            if (op == '+') stack.push(a + b);
            else if (op == '-') stack.push(a - b);
            else if (op == '*') stack.push(a * b);
            else if (op == '/') {
                if (b == 0) throw std::runtime_error("Division by zero");
                stack.push(a / b);
            }
            else if (op == '^') stack.push(std::pow(a, b));
        }
    }
    return stack.pop();
}

int main() {
    std::string postfix = "2 3 4 * +";
    std::cout << "Result: " << evaluatePostfix(postfix) << std::endl; // 14
    return 0;
}`,
  },

  java: {
    stack: `class StackNode<T> {
    T value;
    StackNode<T> next;
    StackNode(T value, StackNode<T> next) {
        this.value = value;
        this.next = next;
    }
}

class LinkedListStack<T> {
    private StackNode<T> topNode = null;

    public void push(T item) {
        this.topNode = new StackNode<>(item, this.topNode);
    }

    public T pop() {
        if (isEmpty()) return null;
        T val = this.topNode.value;
        this.topNode = this.topNode.next;
        return val;
    }

    public boolean isEmpty() {
        return this.topNode == null;
    }
}`,
    algorithm: `public static double evaluate(String postfix) {
    LinkedListStack<Double> stack = new LinkedListStack<>();
    String[] tokens = postfix.trim().split("\\\\s+");

    for (String token : tokens) {
        if (token.matches("-?\\\\d+(\\\\.\\\\d+)?")) {
            stack.push(Double.parseDouble(token));
        } else {
            Double b = stack.pop(); // Right operand
            Double a = stack.pop(); // Left operand
            if (a == null || b == null) throw new IllegalArgumentException("Stack underflow");

            switch (token) {
                case "+": stack.push(a + b); break;
                case "-": stack.push(a - b); break;
                case "*": stack.push(a * b); break;
                case "/":
                    if (b == 0) throw new ArithmeticException("Division by zero");
                    stack.push(a / b);
                    break;
                case "^": stack.push(Math.pow(a, b)); break;
            }
        }
    }
    return stack.pop();
}`,
    full: `class StackNode<T> {
    T value;
    StackNode<T> next;
    StackNode(T value, StackNode<T> next) {
        this.value = value;
        this.next = next;
    }
}

class LinkedListStack<T> {
    private StackNode<T> topNode = null;

    public void push(T item) {
        this.topNode = new StackNode<>(item, this.topNode);
    }

    public T pop() {
        if (isEmpty()) return null;
        T val = this.topNode.value;
        this.topNode = this.topNode.next;
        return val;
    }

    public boolean isEmpty() { return this.topNode == null; }
}

public class PostfixEvaluator {
    public static double evaluate(String postfix) {
        LinkedListStack<Double> stack = new LinkedListStack<>();
        String[] tokens = postfix.trim().split("\\\\s+");

        for (String token : tokens) {
            if (token.matches("-?\\\\d+(\\\\.\\\\d+)?")) {
                stack.push(Double.parseDouble(token));
            } else {
                Double b = stack.pop();
                Double a = stack.pop();
                if (a == null || b == null) throw new IllegalArgumentException("Syntax error");

                switch (token) {
                    case "+": stack.push(a + b); break;
                    case "-": stack.push(a - b); break;
                    case "*": stack.push(a * b); break;
                    case "/":
                        if (b == 0) throw new ArithmeticException("Division by zero");
                        stack.push(a / b);
                        break;
                    case "^": stack.push(Math.pow(a, b)); break;
                }
            }
        }
        return stack.pop();
    }

    public static void main(String[] args) {
        System.out.println("Result: " + evaluate("2 3 4 * +")); // 14.0
    }
}`,
  },

  c: {
    stack: `// Linked List Stack for Float/Double Operands in C
#include <stdio.h>
#include <stdlib.h>

typedef struct DoubleNode {
    double data;
    struct DoubleNode* next;
} DoubleNode;

void push(DoubleNode** top, double val) {
    DoubleNode* newNode = (DoubleNode*)malloc(sizeof(DoubleNode));
    newNode->data = val;
    newNode->next = *top;
    *top = newNode;
}

double pop(DoubleNode** top) {
    if (*top == NULL) return 0.0;
    DoubleNode* temp = *top;
    double val = temp->data;
    *top = (*top)->next;
    free(temp);
    return val;
}

int isEmpty(DoubleNode* top) {
    return top == NULL;
}`,
    algorithm: `double evaluatePostfix(char* postfix) {
    DoubleNode* stack = NULL;
    char* token = strtok(postfix, " ");

    while (token != NULL) {
        if (strcmp(token, "+") == 0) {
            double b = pop(&stack);
            double a = pop(&stack);
            push(&stack, a + b);
        } else if (strcmp(token, "-") == 0) {
            double b = pop(&stack);
            double a = pop(&stack);
            push(&stack, a - b);
        } else if (strcmp(token, "*") == 0) {
            double b = pop(&stack);
            double a = pop(&stack);
            push(&stack, a * b);
        } else if (strcmp(token, "/") == 0) {
            double b = pop(&stack);
            double a = pop(&stack);
            push(&stack, a / b);
        } else if (strcmp(token, "^") == 0) {
            double b = pop(&stack);
            double a = pop(&stack);
            push(&stack, pow(a, b));
        } else {
            push(&stack, atof(token));
        }
        token = strtok(NULL, " ");
    }
    return pop(&stack);
}`,
    full: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

typedef struct DoubleNode {
    double data;
    struct DoubleNode* next;
} DoubleNode;

void push(DoubleNode** top, double val) {
    DoubleNode* newNode = (DoubleNode*)malloc(sizeof(DoubleNode));
    newNode->data = val;
    newNode->next = *top;
    *top = newNode;
}

double pop(DoubleNode** top) {
    if (*top == NULL) return 0.0;
    DoubleNode* temp = *top;
    double val = temp->data;
    *top = (*top)->next;
    free(temp);
    return val;
}

int isEmpty(DoubleNode* top) { return top == NULL; }

double evaluatePostfix(char* postfix) {
    DoubleNode* stack = NULL;
    char* token = strtok(postfix, " ");

    while (token != NULL) {
        if (strcmp(token, "+") == 0) {
            double b = pop(&stack);
            double a = pop(&stack);
            push(&stack, a + b);
        } else if (strcmp(token, "-") == 0) {
            double b = pop(&stack);
            double a = pop(&stack);
            push(&stack, a - b);
        } else if (strcmp(token, "*") == 0) {
            double b = pop(&stack);
            double a = pop(&stack);
            push(&stack, a * b);
        } else if (strcmp(token, "/") == 0) {
            double b = pop(&stack);
            double a = pop(&stack);
            push(&stack, a / b);
        } else if (strcmp(token, "^") == 0) {
            double b = pop(&stack);
            double a = pop(&stack);
            push(&stack, pow(a, b));
        } else {
            push(&stack, atof(token));
        }
        token = strtok(NULL, " ");
    }
    return pop(&stack);
}

int main() {
    char postfix[] = "2 3 4 * +";
    printf("Result: %f\\n", evaluatePostfix(postfix)); // 14.000000
    return 0;
}`,
  },
};
