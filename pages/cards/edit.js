import React , { Component } from 'react';

import {
  Page,
  Card,
  PageActions,
} from "@shopify/polaris";
import Router from "next/router";

import CardForm from "@app/components/Forms/CardForm";

import CardService from "@app/services/CardService";
import OccasionService from "@app/services/OccasionService";

class CardsEdit extends React.Component {

  constructor() {
    super();
    this.state = {
      currentCard: null,
      pageIsReady: false,
      allOccasions: [],
    };
  }

  async componentDidMount() {
    const { id, cardDesign } = Router.query;
    await this.fetchOccasions();
    this.setState({
      currentCard: JSON.parse(cardDesign),
      pageIsReady: true,
    });
  }

  /**
   * Fetch occasions
   */
  async fetchOccasions(){

    try {
      const {
        data: { payload },
      } = await OccasionService.fetchAll();
      this.setState({ allOccasions: payload.occasions });
    } catch (error) {
      console.log(error);
    }
  }

  onCardFormUpdate({ card }) {
    this.setState((prevState) => ({
      ...prevState,
      currentCard: card,
    }));
  }

  async updateCard() {
    const { shop } = this.props;

    const {
      currentCard,
    } = this.state;
    try {
      await CardService.update(
        currentCard._id,
        currentCard
      );

      Router.push("/cards");

    }catch(error){
      console.log("Error at Create card handleSave ", error);
    }
  }

  render() {
    const {
      currentCard,
      allOccasions
    } = this.state;

    if (!currentCard) {
      return null;
    }

    return (
      <Page
        breadcrumbs={[
          {
            content: "Back to Card Designs",
            onAction: () => Router.push({ pathname: "/cards" }),
          },
        ]}
      >
        <Card title="Edit" sectioned>
          <CardForm
            data={currentCard}
            allOccasions={allOccasions}
            onUpdate={this.onCardFormUpdate.bind(this)}
          />
        </Card>

        <div style={{ marginTop: 20 }}>
          <PageActions
            primaryAction={{
              content: "Update",
              onAction: () => this.updateCard(),
            }}
          />
        </div>

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
