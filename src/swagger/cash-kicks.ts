export const CASH_KICKS_SWAGGER_RESPONSES = {
  created: {
    id: 21,
    seeker_id: 19,
    contract_id: 3,
    status: 'pending',
    created_by: 19,
    updated_by: 19,
    created_at: '2024-07-18T07:28:58.000Z',
    updated_at: '2024-07-18T07:28:58.000Z',
    cash_kick_id: {
      id: 16,
      seeker_id: 19,
      name: 'cask kick one',
      maturity_date: null,
      total_financed: '20000.25',
      total_received: '0.00',
      status: 'pending',
      created_by: 19,
      updated_by: 19,
      created_at: '2024-07-18T07:28:58.000Z',
      updated_at: '2024-07-18T07:28:58.000Z',
    },
  },

  updated: {
    id: 1,
    seeker_id: 19,
    contract_id: 3,
    status: 'active',
    created_by: 19,
    updated_by: 6,
    created_at: '2024-07-18T06:59:28.000Z',
    updated_at: '2024-07-18T11:31:23.000Z',
  },

  notFound: {
    statusCode: 404,
    message: 'contract not found',
    timestamp: '2024-07-18T11:32:28.400Z',
    path: '/cash-kicks/60/cash-kick-contracts/3',
  },
};
