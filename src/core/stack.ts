/**
 * Generic Stack Data Structure Implementation (LIFO - Last In First Out)
 */
export class Stack<T> {
  private items: T[] = [];

  constructor(initialItems?: T[]) {
    if (initialItems && initialItems.length > 0) {
      this.items = [...initialItems];
    }
  }

  /**
   * Pushes an element onto the top of the stack.
   */
  push(item: T): void {
    this.items.push(item);
  }

  /**
   * Removes and returns the top element of the stack.
   * Returns undefined if the stack is empty.
   */
  pop(): T | undefined {
    return this.items.pop();
  }

  /**
   * Returns the top element without removing it.
   * Returns undefined if the stack is empty.
   */
  peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.items.length - 1];
  }

  /**
   * Returns true if the stack contains no elements.
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Returns the number of elements in the stack.
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Returns an array containing the elements from bottom to top.
   */
  toArray(): T[] {
    return [...this.items];
  }

  /**
   * Clears all elements from the stack.
   */
  clear(): void {
    this.items = [];
  }

  /**
   * Creates a deep clone of the current stack.
   */
  clone(): Stack<T> {
    return new Stack<T>([...this.items]);
  }
}
