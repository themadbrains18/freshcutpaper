
import React , { Component } from 'react';
import {
  Page,
  Card,
  PageActions,
  TextField,
  Button,
  Toast,
  SettingToggle,
  TextStyle,
} from "@shopify/polaris";
import Router from "next/router";

import SettingsService from "@app/services/SettingsService";

import OccasionService from "@app/services/OccasionService";

class QuotesEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      settings: {
        appEnabled: true,
        couponCode: "",
        deliveryHeading: "",
        deliveryText: "",
        discountText: "",
        minDate: 0,
        futureDateActive: false,
      },
      pageIsReady: false,
      showToast: false,
    };
  }

  async componentDidMount() {
    await this.fetchSettings();
  }

  toggleToast() {
    this.setState({ showToast: !this.state.showToast });
  }

  /**
   * Fetch Settings
   */
  async fetchSettings() {
    try {
      const {
        data: { payload },
      } = await SettingsService.fetchAll();
      if (!payload) {
        return;
      }
      this.setState((prevState) => ({
        settings: {
          ...prevState.settings,
          appEnabled: payload.appEnabled,
          couponCode: payload.couponCode,
          deliveryText: payload.deliveryText,
          discountText: payload.discountText,
          deliveryHeading: payload.deliveryHeading,
          minDate: payload.minDate,
          futureDateActive: payload.futureDateActive,
        },
      }));
    } catch (error) {
      console.log(error);
    }
  }

  handleCouponChange(coupon) {
    this.setState((prevState) => ({
      settings: {
        ...prevState.settings,
        couponCode: coupon,
      },
    }));
  }

  handleDiscountTextChange(text) {
    this.setState((prevState) => ({
      settings: {
        ...prevState.settings,
        discountText: text,
      },
    }));
  }

  handleMinDateChange(minDate) {
    this.setState((prevState) => ({
      settings: {
        ...prevState.settings,
        minDate: minDate,
      },
    }));
  }

  handleDeliveryHeadingChange(text) {
    this.setState((prevState) => ({
      settings: {
        ...prevState.settings,
        deliveryHeading: text,
      },
    }));
  }

  handleDeliveryChange(text) {
    this.setState((prevState) => ({
      settings: {
        ...prevState.settings,
        deliveryText: text,
      },
    }));
  }

  handleFutureDateToggle(futureDateActive) {
    this.setState((prevState) => ({
      settings: {
        ...prevState.settings,
        futureDateActive: !this.state.settings.futureDateActive,
      },
    }));
  }

  handleAppEnabledToggle(appEnabled) {
    this.setState((prevState) => ({
      settings: {
        ...prevState.settings,
        appEnabled: !this.state.settings.appEnabled,
      },
    }));
  }

  renderToast() {
    const { showToast } = this.state;

    if (showToast) {
      return (
        <Toast
          content="Settings saved"
          duration="2000"
          onDismiss={() => this.toggleToast()}
        />
      );
    } else {
      return "";
    }
  }

  render() {
    const { settings, pageIsReady } = this.state;

    const futureDateContentStatus = settings.futureDateActive
      ? "Deactivate"
      : "Activate";
    const futureDateTextStatus = settings.futureDateActive
      ? "activated"
      : "deactivated";
    const appEnabledTextStatus = settings.appEnabled ? "Disable" : "Enable";

    return (
      <Page title="Settings" separator={true}>
        <div style={{ marginTop: "0px" }}>
          <SettingToggle
            action={{
              content: appEnabledTextStatus,
              onAction: (e) => this.handleAppEnabledToggle(e),
            }}
            enabled={settings.appEnabled}
          >
            App is{" "}
            <TextStyle variation="strong">
              {settings.appEnabled ? "Enabled" : "Disabled"}
            </TextStyle>
            .
          </SettingToggle>
        </div>
        <div style={{ marginTop: "10px" }}>
          <TextField
            label="Discount Code"
            value={settings.couponCode}
            onChange={(e) => {
              this.handleCouponChange(e);
            }}
            helpText="Copy here the discount code created in Shopify's Discounts"
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <TextField
            label="Discount Text"
            value={settings.discountText}
            onChange={(e) => {
              this.handleDiscountTextChange(e);
            }}
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <TextField
            label="Delivery Heading"
            value={settings.deliveryHeading}
            onChange={(e) => {
              this.handleDeliveryHeadingChange(e);
            }}
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <TextField
            label="Delivery Text"
            value={settings.deliveryText}
            onChange={(e) => {
              this.handleDeliveryChange(e);
            }}
            multiline={4}
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <TextField
            label="First available delivery date"
            type="number"
            value={settings.minDate}
            onChange={(e) => {
              this.handleMinDateChange(e);
            }}
            multiline={1}
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <SettingToggle
            action={{
              content: futureDateContentStatus,
              onAction: (e) => this.handleFutureDateToggle(e),
            }}
            enabled={settings.futureDateActive}
          >
            Future date is{" "}
            <TextStyle variation="strong">{futureDateTextStatus}</TextStyle>.
          </SettingToggle>
        </div>
        <div style={{ marginTop: "10px" }}>
          <Button
            onClick={(e) => {
              this.saveSettings(e);
            }}
            primary
          >
            Save
          </Button>
        </div>
        {this.renderToast()}
      </Page>
    );
  }

  async saveSettings() {
    const { settings } = this.state;

    try {
      const {
        data: { payload },
      } = await SettingsService.update(settings);

      this.toggleToast();
    } catch (error) {
      console.log("Error at Saving settings", error);
    }
  }
}

export default QuotesEdit;
