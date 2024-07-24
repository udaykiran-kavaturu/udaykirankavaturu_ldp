export const AUTH_SWAGGER_RESPONSES = {
  register: {
    type: 'lender',
    name: 'john panther',
    email: 'john6@john.com',
    credit_limit: 0,
    credit_balance: 0,
    id: 13,
    status: 1,
  },

  login: {
    access_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYsInVzZXJuYW1lIjoiam9obiBwYW50aGVyIiwidHlwZSI6ImxlbmRlciIsImlhdCI6MTcyMTA0MTUzMCwiZXhwIjoxNzIxMDQyMTMwfQ.qBspQ9yRfa4vYVL9hgJfBcLX415ETdObRQu3kffMuTs',
  },

  logout: { message: 'logged out' },
};

export const AUTH_HEADERS = {
  authenticationHeader:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGVzIjpbImFkbWluIl0sImlhdCI6MTcyMTAzNTUzNSwiZXhwIjoxNzIxMDM2MTM1fQ.DFCqSP7fRzwq6iIiuz4d1Dr43LTJbjycpY2pNkpkwzk',
};
