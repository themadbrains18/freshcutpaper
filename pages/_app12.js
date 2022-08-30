import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import App from "next/app";
import {
  AppProvider,
  Frame,
  ContextualSaveBar,
} from "@shopify/polaris";
import { Provider, useAppBridge } from "@shopify/app-bridge-react";
// import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import createApp from "@shopify/app-bridge";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import Router from "next/router";
import Cookies from "universal-cookie";
import ShopService from "@app/services/ShopService";


const cookies = new Cookies();
const shopOrigin = cookies.get("shopOrigin");

export const app = createApp({
  apiKey: API_KEY,
  shopOrigin: shopOrigin,
});

//Components
import IntroPreloader from "../app/components/IntroPreloader";
import SidebarNavigation from "../app/components/SidebarNavigation";


class MyApp extends App {

  constructor() {
    super();
    this.state = {
      shop: null,
      prevState: null,
      appReady: false,
      loadingPage: false,
      shopError: null,
      fetchingShop: false
    }
  }

  async componentDidMount() {
    const { Component, pageProps } = this.props;
    try {
      const shop = await this.fetchShop();
      this.setState({ shop, appReady: true });
      this.setState({ prevState: shop});

    } catch (error) {
      alert(error.message);
    }

    Router.events.on('routeChangeStart', () => this.setState({ loadingPage: true }));
    Router.events.on('routeChangeComplete', () => this.setState({ loadingPage: false }));
    Router.events.on('routeChangeError', () => console.log("err"));
  }

  redirectTo = (file) => {

    const app = createApp({
      host: this.props.host,
      apiKey: API_KEY,
      shopOrigin: this.state.shop,
    });
    const redirect = Redirect.create(app);
    redirect.dispatch(Redirect.Action.REMOTE, {
      url: `${app.localOrigin}/public/widget/${file}`,
      newContext: true
    });
  };

  /**
   * Fetch shop
   */
   async fetchShop() {
    return new Promise(async (resolve, reject) => {
      this.setState({ fetchingShop: true });
      try {
        const {
          data: { payload },
        } = await ShopService.fetch();
        const shop = payload;

        resolve(shop);
      } catch (error) {
        reject(error);
      } finally {
        this.setState({ fetchingShop: false });
      }
    });
  }

  openNewTab(url){
    const redirect = Redirect.create(app);
    redirect.dispatch(Redirect.Action.REMOTE, {
      url: url,
      newContext: true,
    });
  }

  /**
   * Render App
   */
   renderApp() {
    const { Component  } = this.props;
    const {
      shop,
      fetchingShop,
    } = this.state;

    if (fetchingShop || !shop) {
      return <IntroPreloader />;
    }

    return (
      <Frame
        navigation={
            <SidebarNavigation/>
        }
      >

         <Component
         apiKey={API_KEY}
          Component={Component}
          openNewTab={this.openNewTab.bind(this)}
          redirectTo={this.redirectTo.bind(this)}
          shopOrigin={shopOrigin}
          shop={"aj-development-otm.myshopify.com"}
          {...this.props.pageProps}
         />

      </Frame>
    );
   }

  render() {
    const { Component, pageProps, shopOrigin, host } = this.props;
    return (
      <AppProvider i18n={translations}>
        <Provider
          config={{
            apiKey: API_KEY,
            shopOrigin: shopOrigin,
            forceRedirect: true,
          }}
        >
         {this.renderApp()}
        </Provider>
      </AppProvider>
    );
  }
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    shopOrigin: ctx.query.shop,
    host: ctx.query.host,
  }
}

export default MyApp;
