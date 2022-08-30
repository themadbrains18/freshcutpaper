/**********************************************/
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

const defaultCard = {
  title: "",
  image_url: "",
  coupon_id: null,
  character_count: 20,
  product_id: null
};

class CardsCreate extends React.Component {
  constructor() {
    super();
    this.state = {
      card: defaultCard,
      allOccasions: [],
    };
  }
  async componentDidMount() {
    await this.fetchOccasions();
    this.setState({
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
      card,
    }));
  }

  async handleSave() {
    const {
      card,
    } = this.state;

    try {

      const {
        data: { payload },
      } = await CardService.save(card);

      Router.push("/cards");

    }catch(error){
      console.log("Error at Create card handleSave ", error);
    }
  }

  render() {
    const {
      card,
      allOccasions,
      pageIsReady
    } = this.state;

    if (!pageIsReady) {
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
        <Card title="Create" sectioned>
          <CardForm
            data={card}
            allOccasions={allOccasions}
            onUpdate={this.onCardFormUpdate.bind(this)}
          />
        </Card>

        <div style={{ marginTop: 20 }}>
          <PageActions
            primaryAction={{
              content: "Save",
              onAction: () => this.handleSave()
            }}
          />
        </div>

      </Page>
    )
  }

}

export default CardsCreate;
