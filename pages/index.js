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
  Spinner,
  DisplayText,
} from "@shopify/polaris";
import OrderService from "../app/services/OrderService";
import OrderTable from "@app/components/Tables/OrdersTable";
import OrderList from "@app/components/ResourceLists/OrderList";

// import { app as AppContainer } from "../../pages/_app";

import { Context } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";

class Orders extends React.Component {
  constructor() {
    super();
    this.state = {
      orders: [],
      meta: null,
      currentPage: 0,
      fetchingOrders: false,
      pageIsReady: false,
    };
  }

  async componentDidMount() {
    await this.fetchOrders();
    this.setState({ pageIsReady: true });
  }

  updateOrder(id, itemAttributes) {
    var index = this.state.orders.findIndex((x) => x._id === id);
    if (index === -1) {
    } else {
      this.setState({
        orders: [
          ...this.state.orders.slice(0, index),
          Object.assign({}, this.state.orders[index], itemAttributes),
          ...this.state.orders.slice(index + 1),
        ],
      });
    }
  }

  redirectTo = (file) => {
    const redirect = Redirect.create(AppContainer);
    redirect.dispatch(Redirect.Action.REMOTE, {
      url: `${AppContainer.localOrigin}/public/widget/${file}`,
      newContext: true,
    });
  };

  handlePackagingSlips = async (selectedOrders) => {
    const selectedOrdersString = selectedOrders.join(",");
    try {
      const data = await OrderService.printPackagingSlips(selectedOrdersString);
      this.props.redirectTo(data.data.payload.file);
    } catch (error) {
      alert(error.message);
    }
  };

  handlePrintPdf = async (selectedOrders) => {
    const { orders } = this.state;
    const selectedOrdersString = selectedOrders.join(",");
    try {
      const data = await OrderService.printCard(selectedOrdersString);
      selectedOrders.forEach(id => {
        this.updateOrder(id, {status: "fulfilled"});
      })
      this.props.redirectTo(data.data.payload.file)
    } catch (error) {
      console.log(error.message);
    }
  };

  handlePageChange = async (page, sort) => {
    this.fetchOrders(page, sort);
  };

  handleSortChange = async (page = 1, sort) => {
    this.fetchOrders(page, sort);
  };

  /**
   * Fetch Orders
   * @param  {} page=1
   */
  async fetchOrders(page = 1, sort = "status_fulfilled") {
    // if (page === this.state.currentPage) {
    //   return;
    // }
    this.setState({ fetchingOrders: true });
    try {
      const {
        data: { payload, meta },
      } = await OrderService.fetchAll(page, sort);
      this.setState({ orders: payload, meta, currentPage: page });
    } catch (error) {
    } finally {
      this.setState({ fetchingCards: false });
    }
  }

  render() {
    const { orders, meta, currentPage, pageIsReady } = this.state;
    if (!pageIsReady) {
      return (
        <Page title="Orders" separator={true}>
          <Spinner accessibilityLabel="Loading Orders" size="large" />
        </Page>
      );
    }
    return (
      <Page title="Orders" separator={true}>
        <Card>
          <Card.Header></Card.Header>
          <Card.Section>
            {/* <OrderTable
              orders={orders}
              total=""
              onPrint={(order) => this.handlePrintPdf(order)}
            /> */}
            <OrderList
              orders={orders}
              meta={meta}
              onPrint={(order) => this.handlePrintPdf(order)}
              onPrintSlips={(order) => this.handlePackagingSlips(order)}
              onPageChange={(page, sort) => this.handlePageChange(page, sort)}
              onSortChange={(page, sort) => this.handleSortChange(page, sort)}
              openNewTab={(url) => this.props.openNewTab(url)}
              customNewTab={(url) => this.props.customNewTab(url)}
              printAbleCard={(url) => this.props.printAbleCard(orderId)}

              
            />
          </Card.Section>
        </Card>
      </Page>
    );
  }
}

export default Orders;
