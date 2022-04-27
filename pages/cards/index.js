import React , { Component } from 'react';

import {
  Button,
  Page,
  Card,
  TextStyle,
  Spinner
} from "@shopify/polaris";

import Router from "next/router";

import CardService from "@app/services/CardService";

import CardsTable from "@app/components/Tables/CardsTable";
import CardsEdit from "./edit";

class Cards extends React.Component {
  constructor() {
    super();
    this.state = {
      cards: [],
      meta: null,
      currentPage: 0,
      fetchingCards: false,
      pageIsReady: false
    };
  }

  async componentDidMount() {
    await this.fetchCards();
    this.setState({ pageIsReady: true });
  }

  handlePageChange = async (page) => {
    this.fetchCards(page);
  }

  /**
   * Fetch cards
   * @param  {} page
   */
   async fetchCards(page = 1){
    if (page === this.state.currentPage) {
      return;
    }

    this.setState({ fetchingCards: true });

    try {
      const {
        data: { payload, meta },
      } = await CardService.fetchAll(page);

      this.setState({ cards: payload, meta, currentPage: page });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ fetchingCards: false });
    }
  }

  handleCardRemove = async (card) => {
    try {
      await CardService.delete(card._id);

      this.setState({
        cards: this.state.cards.filter(
          (record) => record._id !== card._id
        ),
      });
    } catch (error) {
      alert(error.message);
    }
  }

  render() {
    const {
      cards,
      meta,
      pageIsReady
    } = this.state;

    if(!pageIsReady){
      return (
        <Page title="Card Designs" separator={true}>
          <Spinner accessibilityLabel="Loading Orders" size="large" />
        </Page>
      )
    }
    return (
      <Page title="Card Designs" separator={true}>
        <Card>
          <Card.Header>
            <Button
              primary={true}
              size="slim"
              onClick={() => Router.push({ pathname: "/cards/create" })}
            >
              Create New Design
            </Button>
          </Card.Header>
          <Card.Section>
            <CardsTable
              cards={cards}
              meta={meta}
              total=""
              onDelete={(card) => this.handleCardRemove(card)}
              onPageChange={(page) => this.handlePageChange(page)}
            />
          </Card.Section>
        </Card>
      </Page>
    )
  }

}

export default Cards;
