import React , { Component } from 'react';

import {
  Page,
  Card,
  PageActions,
  DescriptionList,
  Form,
  FormLayout,
  TextField,
  Toast
} from "@shopify/polaris";
import Router from "next/router";

import OrderService from "@app/services/OrderService";
import ImagePreview from "@app/components/ImagePreview";

class CardsEdit extends React.Component {

  constructor() {
    super();
    this.state = {
      currentOrder: null,
      pageIsReady: false,
      showToast: false,
    };
  }

  async componentDidMount() {
    const { id, order } = Router.query;
    console.log(JSON.parse(order));
    this.setState({
      currentOrder: JSON.parse(order),
      pageIsReady: true,
    });
  }

  renderToast(){
    const {
      showToast,
    } = this.state;

    if(showToast){
      return (
        <Toast content="Settings saved" duration="2000" onDismiss={() => this.toggleToast()} />
      )
    }else{
      return "";
    }
  }

  toggleToast(){
    this.setState({showToast: !this.state.showToast});
  }

  onOrderUpdate(message){
    const {
      currentOrder,
    } = this.state;
    let prevCurrentOrder = currentOrder
    prevCurrentOrder.message = message;
    this.setState((prevState) => ({
      ...prevState,
      currentOrder: prevCurrentOrder,
    }));
  }

  async updateOrder() {
    const { shop } = this.props;

    const {
      currentOrder,
    } = this.state;
    try {
      await OrderService.update(
        currentOrder.id,
        currentOrder
      );
      this.toggleToast();
      // Router.push("/");

    }catch(error){
      console.log("Error at Order Update ", error);
    }
  }

  render() {
    const {currentOrder} = this.state;
    if (!currentOrder) {
      return null;
    }

    return (
      <Page
        breadcrumbs={[
          {
            content: "Back to Orders",
            onAction: () => Router.push({ pathname: "/" }),
          },
        ]}
      >
        <DescriptionList
          items={[
            {
              term: 'Order Id',
              description: currentOrder.orderId,
            },
            {
              term: 'Customer name',
              description: currentOrder.customer,
            },
            {
              term: 'Delivery address',
              description:  `${currentOrder.address}` ,
            },
            {
              term: 'Font',
              description:  `${currentOrder.font}` ,
            },
          ]}
        />
        <Form>
          <FormLayout>
            <p style={{ marginTop: "20px"}}><b>Design</b></p>
            <ImagePreview
              src={currentOrder.design}
            />
            <p style={{ marginTop: "15px"}}><b>Message</b></p>
            <TextField
              value={currentOrder.message}
              onChange={this.onOrderUpdate.bind(this)}
              multiline={6}
            />
          </FormLayout>
        </Form>

        <div style={{ marginTop: 20 }}>
          <PageActions
            primaryAction={{
              content: "Update",
              onAction: () => this.updateOrder(),
            }}
          />
        </div>
        {this.renderToast()}
      </Page>
    )
  }

}

/**
 * Draft getInitialProps
 */
 CardsEdit.getInitialProps = async function ({ req, query }) {
  try {
    const { id } = query;

    // what is this?
    const isServer = !!req;

    if (isServer) {
      new Request().setHeader("cookie", req.headers.cookie);
    }

    const {
      data: {
        payload: { card },
      },
    } = await CardService.fetchSingle(id);

    return {
      id,
      card: card,
    };
  } catch (error) {
    console.error("CardsEdit.getInitialProps ", error);
    return error;
  }
};

export default CardsEdit;
