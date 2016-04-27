import cors from 'cors';

export default cors({
  origin: '*',
  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'OPTIONS',
  ],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Accept-Version',
    'X-HTTP-Method-Override',
  ],
  exposedHeaders: [
    'X-Pagination',
  ],
  credentials: true,
  // preflightContinue: true
});
