import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  // NOTE: for the _app component, req and res exist on .ctx property
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  // manually invoke getInitialProps for the component that will be rendered:
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      // pass the custom axios client to all components instead of importing and calling buildClient() in each component
      client,
      data.currentUser
    );
  }
  // ...if you call getInitialProps on _app it disables it for the component about to be rendered which is why we have to do it manually.

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
