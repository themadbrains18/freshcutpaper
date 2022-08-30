import React , { Component } from 'react';
import {
  Button,
  Page,
  Card,
  TextStyle,
  EmptyState,
  Spinner
} from "@shopify/polaris";

import Router from "next/router";

import QuoteService from "@app/services/QuoteService";

import QuotesTable from "@app/components/Tables/QuotesTable";

import OccasionService from "@app/services/OccasionService";

class Quotes extends React.Component {
  constructor() {
    super();
    this.state = {
      quotes: [],
      meta: null,
      currentPage: 0,
      fetchingQuotes: false,
      pageIsReady: false,
      occasion:[]
    };
  }

  async componentDidMount() {
    await this.fetchQuotes();
    this.setState({ pageIsReady: true });
  }

  handlePageChange = async (page) => {
    this.fetchQuotes(page);
  }

  /**
   * Fetch Quotes
   * @param  {} page=1
   */
   async fetchQuotes(page = 1){
    if (page === this.state.currentPage) {
      return;
    }

    this.setState({ fetchingQuotes: true });

    try {
      const {
        data: { payload, meta, occasion },
      } = await QuoteService.fetchAll(page);

      this.setState({ quotes: payload, meta, currentPage: page, occasion : occasion  });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ fetchingQuotes: false });
    }
  }

  handleQuoteRemove = async (quote) => {
    try {
      await QuoteService.delete(quote._id);

      this.setState({
        quotes: this.state.quotes.filter(
          (record) => record._id !== quote._id
        ),
      });
    } catch (error) {
      alert(error.message);
    }
  }

  render() {
    const { shop } = this.props;

    const {
      quotes,
      meta,
      pageIsReady,
      occasion
    } = this.state;

    const hasQuotes = quotes.length > 0;

    /* Filter card according to occassion available */
    let quoteArray=[];
    quotes.map((quote) => {
      if(occasion.includes(quote.occasion)){
        quoteArray.push(quote);
      }
    })

    if (!hasQuotes) {
      return (
        <EmptyState
          heading="You Haven't added any quotes"
          action={
            {
              content: "Create A New quote",
              onAction: () =>
                Router.push({ pathname: "/quotes/create" }),
            }
          }
        >
          <p>
            Here you will see all quotes which you have created
          </p>
        </EmptyState>
      );
    }

    if(!pageIsReady){
      return (
        <Page title="Quotes" separator={true}>
          <Spinner accessibilityLabel="Loading Quotes" size="large" />
        </Page>
      )
    }

    return (
      <Page title="Quotes" separator={true}>
        <Card>
          <Card.Header>
            <Button
              primary={true}
              size="slim"
              onClick={() => Router.push({ pathname: "/quotes/create" })}
            >
              Create New Quote
            </Button>
          </Card.Header>
          <Card.Section>
            <QuotesTable
              quotes={quoteArray}
              total=""
              meta={meta}
              onDelete={(quote) => this.handleQuoteRemove(quote)}
              onPageChange={(page) => this.handlePageChange(page)}
            />
          </Card.Section>
        </Card>
      </Page>
    )
  }

}

export default Quotes;
