import { Node, Output, Property, defineNode } from '@crystalflow/core';

/**
 * Fetch Data Node - Simulates fetching data from an API
 * Useful for testing async execution visualization
 */
@defineNode({
  type: 'async.fetch-data',
  label: 'Fetch Data',
  category: 'Async',
  description: 'Simulates fetching data from an API with realistic delays',
  color: '#4CAF50',
})
export class FetchDataNode extends Node {
  @Property({
    type: 'select',
    label: 'Data Source',
    defaultValue: 'users',
    options: [
      { value: 'users', label: 'User Data (1.5s)' },
      { value: 'products', label: 'Product Data (2s)' },
      { value: 'analytics', label: 'Analytics Data (3s)' },
      { value: 'reports', label: 'Report Data (4s)' },
    ],
  })
  dataSource: string = 'users';

  @Property({
    type: 'boolean',
    label: 'Simulate Network Error',
    defaultValue: false,
    description: 'Simulate a network error for testing error handling',
  })
  simulateError: boolean = false;

  @Output({ type: 'object', label: 'Data' })
  data: any = {};

  async execute() {
    // Simulate different fetch times based on data source
    const fetchTimes: Record<string, number> = {
      users: 1500,
      products: 2000,
      analytics: 3000,
      reports: 4000,
    };

    const fetchTime = fetchTimes[this.dataSource] || 1500;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, fetchTime));

    // Simulate error if enabled
    if (this.simulateError) {
      throw new Error(`Failed to fetch ${this.dataSource} data: Network timeout`);
    }

    // Return mock data based on source
    const mockData: Record<string, any> = {
      users: {
        count: 150,
        users: [
          { id: 1, name: 'Alice Johnson', role: 'Admin' },
          { id: 2, name: 'Bob Smith', role: 'User' },
          { id: 3, name: 'Carol Williams', role: 'Manager' },
        ],
        fetchedAt: new Date().toISOString(),
      },
      products: {
        count: 45,
        products: [
          { id: 101, name: 'Widget Pro', price: 29.99, stock: 120 },
          { id: 102, name: 'Gadget Plus', price: 49.99, stock: 85 },
          { id: 103, name: 'Tool Elite', price: 19.99, stock: 200 },
        ],
        fetchedAt: new Date().toISOString(),
      },
      analytics: {
        visitors: 15234,
        pageViews: 45678,
        avgSessionTime: 245,
        bounceRate: 0.42,
        topPages: ['/home', '/products', '/about'],
        fetchedAt: new Date().toISOString(),
      },
      reports: {
        period: 'Last 30 days',
        revenue: 125430.5,
        orders: 523,
        avgOrderValue: 239.86,
        growth: 15.3,
        fetchedAt: new Date().toISOString(),
      },
    };

    this.data = mockData[this.dataSource] || mockData.users;
  }
}
