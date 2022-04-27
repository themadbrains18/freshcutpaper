import React , { Component } from 'react';

import {
  Page,
  Card,
  PageActions,
} from "@shopify/polaris";
import Router from "next/router";

import QuoteForm from "@app/components/Forms/QuoteForm";
import QuoteService from "@app/services/QuoteService";
import OccasionService from "@app/services/OccasionService";
class QuotesEdit extends React.Component {

  constructor() {
    super();
    this.state = {
      currentQuote: null,
      pageIsReady: false,
      allOccasions: [],
    };
  }

  async componentDidMount() {
    const { id, quote } = Router.query;
    await this.fetchOccasions();
    this.setState({
      currentQuote: JSON.parse(quote),
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

  onQuoteFormUpdate({ quote }) {
    this.setState((prevState) => ({
      ...prevState,
      currentQuote: quote,
    }));
  }

  async updateQuote() {
    const { shop } = this.props;

    const {
      currentQuote,
    } = this.state;
    try {
      await QuoteService.update(
        currentQuote._id,
        currentQuote
      );

      Router.push("/quotes");

    }catch(error){
      console.log("Error at Create quote handleSave ", error);
    }
  }

  render() {
    const {
      currentQuote,
      allOccasions
    } = this.state;

    if (!currentQuote) {
      return null;
    }

    return (
      <Page
        breadcrumbs={[
          {
            content: "Back to Quotes",
            onAction: () => Router.push({ pathname: "/quotes" }),
          },
        ]}
      >
        <Card title="Edit" sectioned>
          <QuoteForm
            data={currentQuote}
            allOccasions={allOccasions}
            onUpdate={this.onQuoteFormUpdate.bind(this)}
          />
        </Card>

        <div style={{ marginTop: 20 }}>
          <PageActions
            primaryAction={{
              content: "Update",
              onAction: () => this.updateQuote(),
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
  QuotesEdit.getInitialProps = async function ({ req, query }) {
  try {
    const { id } = query;

    // what is this?
    const isServer = !!req;

    if (isServer) {
      new Request().setHeader("cookie", req.headers.cookie);
    }

    const {
      data: {
        payload: { quote },
      },
    } = await QuoteService.fetchSingle(id);

    return {
      id,
      quote: quote,
    };
  } catch (error) {
    console.error("QuotesEdit.getInitialProps ", error);
    return error;
  }
};

export default QuotesEdit;
