import { Navigation, Button } from "@shopify/polaris";
import { Fragment, useState } from "react";
import {
  HomeMajor,
  OrdersMajor,
  HeartMajor,
  VocabularyMajor,
  TypeMajor,
  ChannelsMajor,
  SettingsMajor
} from '@shopify/polaris-icons';
import Router from "next/router";

const SidebarNavigation = () => {
  const currentPath = Router.asPath.split("?")[0];

  const pathSelected = (url) => currentPath.indexOf(url) !== -1;

  const isHomePath = currentPath === "/" || currentPath === "/index";

  return (
    <Fragment>
       <Navigation location={Router.asPath}>
        <Navigation.Section
          title="Greeting Cards"
          items={[
            // {
            //   label: "Home",
            //   selected: pathSelected("/"),
            //   onClick: () => Router.push({ pathname: "/" }),
            //   icon: HomeMajor
            // },
            {
              label: "Orders",
              selected: pathSelected("/"),
              onClick: () => Router.push({ pathname: "/" }),
              icon: OrdersMajor
            },
            {
              label: "Card designs",
              selected: pathSelected("/cards"),
              onClick: () => Router.push({ pathname: "/cards" }),
              icon: HeartMajor
            },
            {
              label: "Quotes",
              selected: pathSelected("/quotes"),
              onClick: () => Router.push({ pathname: "/quotes" }),
              icon: VocabularyMajor
            },
            {
              label: "Fonts",
              selected: pathSelected("/fonts"),
              onClick: () => Router.push({ pathname: "/fonts" }),
              icon: TypeMajor
            },
            {
              label: "Occasions",
              selected: pathSelected("/occasions"),
              onClick: () => Router.push({ pathname: "/occasions" }),
              icon: ChannelsMajor
            },
            {
              label: "Settings",
              selected: pathSelected("/settings"),
              onClick: () => Router.push({ pathname: "/settings" }),
              icon: SettingsMajor
            }
          ]}
        />
      </Navigation>
    </Fragment>
  )
}


export default SidebarNavigation;
