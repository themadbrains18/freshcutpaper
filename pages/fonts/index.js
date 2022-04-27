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

import FontService from "@app/services/FontService";

class Fonts extends React.Component {
  constructor() {
    super();
    this.state = {
      fontTextField: null,
      allFonts: [],
      fetchingFonts: false,
    };
  }

  async componentDidMount() {
    await this.fetchFonts();
  }

  /**
   * Fetch fonts
   */
   async fetchFonts(){
    this.setState({ fetchingFonts: true });

    try {
      const {
        data: { payload },
      } = await FontService.fetchAll();
      this.setState({ allFonts: payload.fonts });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ fetchingFonts: false });
    }
  }

  handleFontFieldChange(fontTextField) {
    this.setState((prevState) => ({ ...prevState, fontTextField, }));
   }

   addFont() {
    const { fontTextField, allFonts } = this.state;
    this.setState((prevState) => ({ ...prevState, fontTextField, }));
    allFonts.push(fontTextField);
    this.saveFonts();
    this.setState({fontTextField: null});
   }

   handleRemoveFont(el, fontToRemove) {
    const { fontTextField, allFonts } = this.state;
    const fontArray = allFonts
    var index = fontArray.indexOf(fontToRemove)
    if (index !== -1) {
      fontArray.splice(index, 1);
      this.setState({allFonts: fontArray});
    }
    this.saveFonts();
   }

   async saveFonts() {
    const {
      allFonts,
    } = this.state;
    try {
      const {
        data: { payload },
      } = await FontService.update(allFonts);
    }catch(error){
      console.log("Error at Saving tags", error);
    }
   }

   renderFontTags() {
    const { allFonts } = this.state;
    return(
      <Stack spacing="tight">
        {allFonts.map((font, i) => {
           return (
              <Tag key={font} onRemove={val => this.handleRemoveFont(val, font)}>
               {font}
              </Tag>
            )
        })}
      </Stack>
    )
   }

  render() {
    const { fontTextField } = this.state;
    return (
      <Page title="Font Settings" separator={true}>
        <Card>
          <Card.Header>
          </Card.Header>
          <Card.Section>
            {this.renderFontTags()}
            <div style={{marginTop: 20, marginBottom: 20}}>
              <TextField
                label="Google fonts"
                type="email"
                value={fontTextField}
                onChange={this.handleFontFieldChange.bind(this)}
                helpText="Copy and paste Google font title here and press save"
                />
              </div>
              <Button primary onClick={this.addFont.bind(this)} > Add Font </Button>
          </Card.Section>
        </Card>
      </Page>
    )
  }

}

export default Fonts;
