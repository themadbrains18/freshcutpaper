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

const defaultQuote = {
  title: "",
  quote: "",
};

class QuoteCreate extends React.Component {
  constructor() {
    super();
    this.state = {
      quote: defaultQuote,
      pageIsReady: false,
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

  onQuoteFormUpdate({ quote }) {
    this.setState((prevState) => ({
      ...prevState,
      quote,
    }));
  }

  async handleSave() {
    const {
      quote,
    } = this.state;

    try {

      const {
        data: { payload },
      } = await QuoteService.save(quote);

      Router.push("/quotes");

    }catch(error){
      console.log("Error at Create card handleSave ", error);
    }
  }

  render() {
    const {
      quote,
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
            content: "Back to Quotes",
            onAction: () => Router.push({ pathname: "/quotes" }),
          },
        ]}
      >
        <Card title="Create" sectioned>
          <QuoteForm
            data={quote}
            allOccasions={allOccasions}
            onUpdate={this.onQuoteFormUpdate.bind(this)}
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

export default QuoteCreate;
