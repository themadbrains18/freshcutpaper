import React , { Component } from 'react';

import {
  Button,
  Page,
  Card,
  TextField,
  EmptyState,
  Stack,
  Tag
} from "@shopify/polaris";

import Router from "next/router";

import OccasionService from "@app/services/OccasionService";

class Occasions extends React.Component {
  constructor() {
    super();
    this.state = {
      occasionTextField: null,
      allOccasions: [],
      fetchingOccasions: false,
    };
  }

  async componentDidMount() {
    await this.fetchOccasions();
  }

  /**
   * Fetch occasions
   */
   async fetchOccasions(){
    this.setState({ fetchingOccasions: true });

    try {
      const {
        data: { payload },
      } = await OccasionService.fetchAll();
      this.setState({ allOccasions: payload.occasions });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ fetchingOccasions: false });
    }
  }

  handleOccasionFieldChange(occasionTextField) {
    this.setState((prevState) => ({ ...prevState, occasionTextField, }));
   }

   addOccasion() {
    const { occasionTextField, allOccasions } = this.state;
    this.setState((prevState) => ({ ...prevState, occasionTextField, }));
    allOccasions.push(occasionTextField);
    this.saveOccasions();
    this.setState({occasionTextField: null});
   }

   handleRemoveOccasion(el, occassionToRemove) {
    const { occasionTextField, allOccasions } = this.state;
    const occasionArray = allOccasions;
    var index = occasionArray.indexOf(occassionToRemove);
    if (index !== -1) {
      occasionArray.splice(index, 1);
      this.setState({allOccasions: occasionArray});
    }
    this.saveOccasions();
   }

   async saveOccasions() {
    const {
      allOccasions,
    } = this.state;
    try {
      const {
        data: { payload },
      } = await OccasionService.update(allOccasions);
    }catch(error){
      console.log("Error at Saving occasion", error);
    }
   }

   renderOccasionTags() {
    const { allOccasions } = this.state;
    return(
      <Stack spacing="tight">
        {allOccasions.map((occasion, i) => {
           return (
              <Tag key={occasion} onRemove={val => this.handleRemoveOccasion(val, occasion)}>
               {occasion}
              </Tag>
            )
        })}
      </Stack>
    )
   }

  render() {
    const { occasionTextField } = this.state;
    return (
      <Page title="Occasions" separator={true}>
        <Card>
          <Card.Header>
          </Card.Header>
          <Card.Section>
            {this.renderOccasionTags()}
            <div style={{marginTop: 20, marginBottom: 20}}>
              <TextField
                label="Occasion"
                type="email"
                value={occasionTextField}
                onChange={this.handleOccasionFieldChange.bind(this)}
                />
              </div>
              <Button primary onClick={this.addOccasion.bind(this)} > Add Occasion </Button>
          </Card.Section>
        </Card>
      </Page>
    )
  }

}

export default Occasions;
