import envLoader from '../utils/env_loader';

const startServer = (api) => {
  envLoader();
  const port = process.env.PORT || 5000;
  const env = process.env.npm_lifecycle_event || 'dev';
  api.listen(port, () => {
    console.log(`[${env}] server is listening on port:${port}`);
  });
};

export default startServer;
