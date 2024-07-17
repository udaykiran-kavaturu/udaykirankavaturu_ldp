export const CONTRACTS_SWAGGER_RESPONSES = {
  created: {
    name: 'contract six',
    type: 'monthly',
    amount: 10000,
    fee: 12.5,
    scheduled_due_date: 1,
    created_by: 18,
    lender_id: 18,
    updated_by: null,
    id: 6,
    status: 1,
    created_at: '2024-07-17T05:57:32.000Z',
    updated_at: '2024-07-17T05:57:32.000Z',
  },

  updated: {
    "id": 1,
    "lender_id": null,
    "name": "updating contract",
    "type": "monthly",
    "amount": "10000.00",
    "fee": "12.50",
    "status": 1,
    "scheduled_due_date": 1,
    "created_by": null,
    "updated_by": 6,
    "created_at": "2024-07-17T05:31:27.000Z",
    "updated_at": "2024-07-17T06:50:46.000Z"
  },

  contractNotFound: {
    "statusCode": 404,
    "message": "contract not found",
    "timestamp": "2024-07-17T07:04:42.255Z",
    "path": "/contracts?id=20"
  },
  forbidden: {
    "statusCode": 403,
    "message": "You can only view or update your own contract",
    "timestamp": "2024-07-17T07:04:58.615Z",
    "path": "/contracts?id=1"
  }

};
