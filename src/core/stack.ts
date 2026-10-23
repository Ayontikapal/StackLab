/**
 * Node in a Singly Linked List Stack
 */
export class StackNode<T> {
  value: T;
  next: StackNode<T> | null;

  constructor(value: T, next: StackNode<T> | null = null) {
    this.value = value;
    this.next = next;
  }
}

/**
 * Generic Linked List Stack Data Structure Implementation (LIFO - Last In First Out).
 * Implemented using a singly linked list where topNode represents the head of the list.
 *
 * Time Complexities:
 * - push(item): O(1)
 * - pop(): O(1)
 * - peek(): O(1)
 * - isEmpty(): O(1)
 * - size(): O(1)
 */
export class LinkedListStack<T> {
  private topNode: StackNode<T> | null = null;
  private _size: number = 0;

  constructor(initialItems?: T[]) {
    if (initialItems && initialItems.length > 0) {
      // initialItems are ordered bottom to top, so pushing in order preserves top
      for (const item of initialItems) {
        this.push(item);
      }
    }
  }

  /**
   * Pushes an element onto the top of the stack.
   * Creates a new node pointing to the current top and updates the top pointer.
   * O(1) time complexity.
   */
  push(item: T): void {
    const newNode = new StackNode<T>(item, this.topNode);
    this.topNode = newNode;
    this._size++;
  }

  /**
   * Removes and returns the top element of the stack.
   * Advances the top pointer to topNode.next.
   * Returns undefined if the stack is empty.
   * O(1) time complexity.
   */
  pop(): T | undefined {
    if (this.topNode === null) {
      return undefined;
    }
    const poppedValue = this.topNode.value;
    this.topNode = this.topNode.next;
    this._size--;
    return poppedValue;
  }

  /**
   * Returns the top element without removing it.
   * Returns undefined if the stack is empty.
   * O(1) time complexity.
   */
  peek(): T | undefined {
    if (this.topNode === null) {
      return undefined;
    }
    return this.topNode.value;
  }

  /**
   * Returns true if the stack contains no elements.
   * O(1) time complexity.
   */
  isEmpty(): boolean {
    return this.topNode === null;
  }

  /**
   * Returns the number of elements in the stack.
   * O(1) time complexity.
   */
  size(): number {
    return this._size;
  }

  /**
   * Clears all elements from the stack by releasing the head reference.
   * O(1) time complexity.
   */
  clear(): void {
    this.topNode = null;
    this._size = 0;
  }

  /**
   * Returns an array containing the elements from bottom to top.
   * Used for visualization and state snapshotting.
   */
  toArray(): T[] {
    const result: T[] = [];
    let current = this.topNode;
    while (current !== null) {
      result.push(current.value);
      current = current.next;
    }
    // Traversing from topNode gives [top, ..., bottom]; reverse to yield [bottom, ..., top]
    return result.reverse();
  }

  /**
   * Returns an array of node values from top to bottom (linked list traversal order).
   */
  toTopDownArray(): T[] {
    const result: T[] = [];
    let current = this.topNode;
    while (current !== null) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }

  /**
   * Returns the top node of the linked list for direct inspection/visualization.
   */
  getTopNode(): StackNode<T> | null {
    return this.topNode;
  }

  /**
   * Creates a deep clone of the current stack preserving node structure.
   */
  clone(): LinkedListStack<T> {
    const cloned = new LinkedListStack<T>();
    // toArray() returns bottom to top, so pushing bottom to top reconstructs exact state
    const items = this.toArray();
    for (const item of items) {
      cloned.push(item);
    }
    return cloned;
  }
}

// Export LinkedListStack as Stack for drop-in usage across the application
export { LinkedListStack as Stack };
