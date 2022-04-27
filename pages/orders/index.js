import React , { Component } from 'react';

import {
  Layout,
  Button,
  SettingToggle,
  TextStyle,
  Icon,
  Tooltip,
  Page,
  Card,
  DisplayText
} from "@shopify/polaris";
import OrderService from "../../app/services/OrderService";
import OrderTable from "@app/components/Tables/OrdersTable";
import OrderList from "@app/components/ResourceLists/OrderList";

// import { app as AppContainer } from "../../pages/_app";

import { Context } from '@shopify/app-bridge-react'
import { Redirect } from '@shopify/app-bridge/actions';

class Orders extends React.Component {
  constructor() {
    super();
    this.state = {
      orders: [],
      meta: null,
      currentPage: 0,
      fetchingOrders: false,
      pageIsReady: false
    };
  }

  async componentDidMount() {
    await this.fetchOrders();
    this.setState({ pageIsReady: true });
  }

  redirectTo = (file) => {
    const redirect = Redirect.create(AppContainer);
    redirect.dispatch(Redirect.Action.REMOTE, {
      url: `${AppContainer.localOrigin}/public/widget/${file}`,
      newContext: true
    });
  };

  handlePrintPdf = async (selectedOrders) => {
    // try {
    //   const data = await OrderService.printCard(order._id);
    //   console.log({data: data, props: this.props});
    //   this.props.redirectTo(data.data.payload.file)
    // } catch (error) {
    //   alert(error.message);
    // }
  }

  /**
   * Fetch Orders
   * @param  {} page=1
   */
  async fetchOrders(page = 1, sort = "latest"){
    if (page === this.state.currentPage) {
      return;
    }
    this.setState({ fetchingOrders: true });

    try {
      const {
        data: { payload, meta },
      } = await OrderService.fetchAll();

      this.setState({ orders: payload, meta, currentPage: page });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ fetchingCards: false });
    }
  }

  render() {
    const {
      orders,
      meta,
      pageIsReady,
    } = this.state;


    return (
      <Page title="Orders" separator={true}>
        <Card>
          <Card.Header>
          </Card.Header>
          <Card.Section>
            {/* <OrderTable
              orders={orders}
              total=""
              onPrint={(order) => this.handlePrintPdf(order)}
            /> */}
            <OrderList

            />
          </Card.Section>
        </Card>
      </Page>
    )
  }

}

export default Orders;
