import { describe, it, expect } from 'vitest';
import { LinkedListStack, StackNode } from '../stack';

describe('LinkedListStack Implementation', () => {
  it('creates individual StackNode with value and next pointer', () => {
    const nextNode = new StackNode<number>(100);
    const node = new StackNode<number>(50, nextNode);
    expect(node.value).toBe(50);
    expect(node.next).toBe(nextNode);
    expect(node.next?.value).toBe(100);
  });

  it('instantiates empty stack with null topNode', () => {
    const stack = new LinkedListStack<string>();
    expect(stack.isEmpty()).toBe(true);
    expect(stack.size()).toBe(0);
    expect(stack.peek()).toBeUndefined();
    expect(stack.pop()).toBeUndefined();
    expect(stack.getTopNode()).toBeNull();
    expect(stack.toArray()).toEqual([]);
  });

  it('maintains correct pointer linkages on push and pop', () => {
    const stack = new LinkedListStack<string>();
    
    // Push 'A'
    stack.push('A');
    expect(stack.size()).toBe(1);
    expect(stack.peek()).toBe('A');
    expect(stack.getTopNode()?.value).toBe('A');
    expect(stack.getTopNode()?.next).toBeNull();
    expect(stack.toArray()).toEqual(['A']);

    // Push 'B' (should become new top, pointing to 'A')
    stack.push('B');
    expect(stack.size()).toBe(2);
    expect(stack.peek()).toBe('B');
    expect(stack.getTopNode()?.value).toBe('B');
    expect(stack.getTopNode()?.next?.value).toBe('A');
    expect(stack.getTopNode()?.next?.next).toBeNull();
    expect(stack.toArray()).toEqual(['A', 'B']); // bottom to top
    expect(stack.toTopDownArray()).toEqual(['B', 'A']); // top to bottom

    // Push 'C'
    stack.push('C');
    expect(stack.size()).toBe(3);
    expect(stack.peek()).toBe('C');
    expect(stack.getTopNode()?.value).toBe('C');
    expect(stack.getTopNode()?.next?.value).toBe('B');
    expect(stack.toArray()).toEqual(['A', 'B', 'C']);

    // Pop 'C'
    const poppedC = stack.pop();
    expect(poppedC).toBe('C');
    expect(stack.size()).toBe(2);
    expect(stack.peek()).toBe('B');
    expect(stack.getTopNode()?.value).toBe('B');
    expect(stack.getTopNode()?.next?.value).toBe('A');

    // Pop 'B'
    const poppedB = stack.pop();
    expect(poppedB).toBe('B');
    expect(stack.size()).toBe(1);
    expect(stack.peek()).toBe('A');
    expect(stack.getTopNode()?.next).toBeNull();

    // Pop 'A'
    const poppedA = stack.pop();
    expect(poppedA).toBe('A');
    expect(stack.isEmpty()).toBe(true);
    expect(stack.size()).toBe(0);
    expect(stack.getTopNode()).toBeNull();
    expect(stack.pop()).toBeUndefined();
  });

  it('correctly clones and clears linked list stack', () => {
    const stack = new LinkedListStack<number>([1, 2, 3]);
    expect(stack.toArray()).toEqual([1, 2, 3]);
    expect(stack.peek()).toBe(3);

    const cloned = stack.clone();
    expect(cloned.toArray()).toEqual([1, 2, 3]);
    expect(cloned.peek()).toBe(3);

    // Mutating original does not affect clone
    stack.push(4);
    expect(stack.size()).toBe(4);
    expect(cloned.size()).toBe(3);

    stack.clear();
    expect(stack.isEmpty()).toBe(true);
    expect(stack.getTopNode()).toBeNull();
    expect(cloned.size()).toBe(3);
  });
});
