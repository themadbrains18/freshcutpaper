import App from "next/app";
import { AppProvider, Frame } from "@shopify/polaris";
import { Provider } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import createApp from "@shopify/app-bridge";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import Router from "next/router";
import Cookies from "universal-cookie";
import ShopService from "@app/services/ShopService";


const cookies = new Cookies();

const shopOrigin = cookies.get("shopOrigin");

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
      fetchingShop: false,
    };
  }

  async componentDidMount() {
    try {
      const shop = await this.fetchShop();
      this.setState({ shop, appReady: true });
      this.setState({ prevState: shop });
    } catch (error) {
      alert(error.message);
    }

    Router.events.on("routeChangeStart", () =>
      this.setState({ loadingPage: true })
    );
    Router.events.on("routeChangeComplete", () =>
      this.setState({ loadingPage: false })
    );
    Router.events.on("routeChangeError", () => console.log("err"));
  }

  redirectTo = (file) => {
    console.log(file);
    const app = createApp({
      host: SHOPIFY_HOST,
      apiKey: API_KEY,
      shopOrigin: this.state.shop,
    });

    const redirect = Redirect.create(app);

    redirect.dispatch(Redirect.Action.REMOTE, {
      url: `${app.localOrigin}/public/widget/generatedPdfs/${file}`,
      newContext: true,
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

  openNewTab(url) {
    console.log(url);
    const app = createApp({
      host: SHOPIFY_HOST,
      apiKey: API_KEY,
      shopOrigin: this.state.shop,
    });

    const redirect = Redirect.create(app);

    let shop = this.state.shop.shop;

    window.open( 
      `https://${shop}/${url}`, "_blank");
    // redirect.dispatch(Redirect.Action.REMOTE, {
    //   url: `https://${shop}/${url}`,
    //   newContext: true,
    // });
  }

  /**
   * 
   * @param {*} custom url open app hosted pdf 
   */
  customNewTab(url) {
    console.log(url);
    
    const app = createApp({
      host: SHOPIFY_HOST,
      apiKey: API_KEY,
      shopOrigin: this.state.shop,
    });

    const redirect = Redirect.create(app);
    
    let shop = HOST;
    window.open( 
      `${shop}/${url}`, "_blank");
    // redirect.dispatch(Redirect.Action.REMOTE, {
    //   url: `${shop}/${url}`,
    //   newContext: true,
    // });
  }



  /**
   * Render App
   */
  renderApp() {
    const { Component, pageProps } = this.props;
    const { shop, fetchingShop } = this.state;

    if (fetchingShop || !shop) {
      return <IntroPreloader />;
    }

    return (
      <Frame navigation={<SidebarNavigation />}>
        <Component
          apiKey={API_KEY}
          shopOrigin={shopOrigin}
          shop={shopOrigin}
          openNewTab={this.openNewTab.bind(this)}
          customNewTab={this.customNewTab.bind(this)}
          redirectTo={this.redirectTo.bind(this)}
          {...this.props.pageProps}
        />
        {/* <MyProvider
         Component={Component}
         openNewTab={this.openNewTab.bind(this)}
         redirectTo={this.redirectTo.bind(this)}
         shop={shopOrigin}
         {...pageProps} /> */}
      </Frame>
    );
  }

  render() {

    const { Component, pageProps, host } = this.props;

    // console.log({
    //   host: host, 
    //   apiKey: API_KEY,
    //   forceRedirect: true,
    //   shopOrigin: shopOrigin,
    // });

    return (
      <AppProvider i18n={translations}>
        <Provider
          config={{
            host: process.env.SHOPIFY_HOST,
            apiKey: API_KEY,
            forceRedirect: true,
            shopOrigin: shopOrigin,
          }}
        >
          {this.renderApp()}
        </Provider>
      </AppProvider>
    );
  }
}

MyApp.getInitialProps = async ({ ctx }) => {
  console.log(ctx);
  return {
    host: ctx.query.host
  };
};

export default MyApp;
