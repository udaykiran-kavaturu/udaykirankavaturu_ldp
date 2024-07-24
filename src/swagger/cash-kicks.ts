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

  scheduleUpdated: {
    id: 145,
    lender_id: 6,
    seeker_id: 19,
    cash_kick_id: 6,
    contract_id: 3,
    amount: '833.35',
    due_date: '2024-08-01',
    status: 'paid',
    created_by: 6,
    updated_by: 6,
    created_at: '2024-07-18T11:28:56.000Z',
    updated_at: '2024-07-19T05:29:05.000Z',
  },

  scheduleNotFound: {
    statusCode: 404,
    message: 'schedule entry not found',
    timestamp: '2024-07-19T05:29:20.858Z',
    path: '/cash-kicks/6/cash-kick-contracts/3/schedule/1459',
  },

  forbidden: {
    statusCode: 403,
    message: 'you can only view or update your own cash kick',
    timestamp: '2024-07-19T07:02:14.514Z',
    path: '/cash-kicks?id=3',
  },

  cashKickNotFound: {
    statusCode: 404,
    message: 'cash kick not found',
    timestamp: '2024-07-19T07:02:48.924Z',
    path: '/cash-kicks?id=39',
  },

  getCashKicks: {
    description: 'Any one of the below two responses are possible',
    getAllCashKicks: {
      data: [
        {
          id: 4,
          seeker_id: 19,
          name: 'cask kick one',
          maturity_date: null,
          total_financed: '0.00',
          total_received: '0.00',
          status: 'pending',
          created_by: 19,
          updated_by: null,
          created_at: '2024-07-18T06:43:42.000Z',
          updated_at: '2024-07-18T06:43:42.000Z',
        },
      ],
      meta: {
        total: 14,
        page: '1',
        limit: '20',
        totalPages: 1,
      },
    },

    getCashKickByID: {
      id: 4,
      seeker_id: 19,
      name: 'cask kick one',
      maturity_date: null,
      total_financed: '0.00',
      total_received: '0.00',
      status: 'pending',
      created_by: 19,
      updated_by: null,
      created_at: '2024-07-18T06:43:42.000Z',
      updated_at: '2024-07-18T06:43:42.000Z',
    },
  },
};
