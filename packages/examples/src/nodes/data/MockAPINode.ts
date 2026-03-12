import { Node, Output, Property, defineNode } from '@crystalflow/core';

/**
 * Mock API Node - Simulates an API response with user data
 * In a real scenario, this would make an actual HTTP request
 */
@defineNode({
  type: 'data.mockapi',
  label: 'Mock API',
  category: 'Data',
  description: 'Simulates an API response with user data',
  color: '#2196F3',
})
export class MockAPINode extends Node {
  @Property({
    type: 'select',
    label: 'Endpoint',
    defaultValue: 'users',
    options: [
      { value: 'users', label: 'Users API' },
      { value: 'posts', label: 'Posts API' },
      { value: 'products', label: 'Products API' },
    ],
  })
  endpoint: string = 'users';

  @Output({ type: 'object', label: 'Response' })
  response: any = {};

  execute() {
    // Simulate API responses based on endpoint
    const mockData = {
      users: {
        status: 200,
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          username: 'johndoe',
          address: {
            street: '123 Main St',
            city: 'San Francisco',
            country: 'USA',
          },
          stats: {
            followers: 1523,
            posts: 42,
            likes: 8934,
          },
        },
      },
      posts: {
        status: 200,
        data: {
          id: 101,
          title: 'Getting Started with CrystalFlow',
          author: 'Jane Smith',
          views: 2543,
          likes: 189,
          published: '2026-01-15',
        },
      },
      products: {
        status: 200,
        data: {
          id: 501,
          name: 'Premium Subscription',
          price: 29.99,
          currency: 'USD',
          features: ['Unlimited workflows', 'Priority support', 'Advanced analytics'],
          inStock: true,
        },
      },
    };

    this.response = mockData[this.endpoint as keyof typeof mockData] || mockData.users;
  }
}
