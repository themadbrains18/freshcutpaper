import { useState, useEffect, Fragment } from "react";
import {
  DataTable,
  ButtonGroup,
  Tooltip,
  Button,
  Link,
  Badge,
  Thumbnail,
  TextStyle
} from "@shopify/polaris";

import { EditMajor, PrintMinor } from "@shopify/polaris-icons";

import Router from "next/router";


const OrderTable = ({ orders, onPrint, total }) => {
  const [rows, setRows] = useState([]);

  const handlePrintPdf = (item) => {
    onPrint ? onPrint(item) : {};
  }

  useEffect(() => {
    const tableOrders = orders.reverse().map((order) => {
      let delivery;
      if(order.delivery){
        if(order.delivery == "asap"){
          delivery = "ASAP";
        }else{
          delivery = order.arriveByDate;
        }
      }else{
        delivery = "Not defined";
      }
      const orderUrl = `/admin/orders/${order.orderId}`
      return [
        order.orderId,
        <Thumbnail
          source={order.designId}
        />,
        order.firstName + " " + order.lastName,
        order.deliverTo,
        delivery,
        <ButtonGroup>
           <Tooltip content="Print PDF">
            <Button
              size="slim"
              icon={PrintMinor}
              plain
              onClick={() => handlePrintPdf(order)}
            ></Button>
          </Tooltip>
          
          <Tooltip content="Edit">
            <Button
              size="slim"
              icon={EditMajor}
              plain
              onClick={() =>
                Router.push({
                  pathname: "/orders/edit",
                  query: { id: order._id, order: JSON.stringify(order) },
                })
              }
            ></Button>
          </Tooltip>
        </ButtonGroup>

      ]
    });

    setRows(tableOrders);
  }, [orders])

  return (
    <Fragment>
      <DataTable
        columnContentTypes={[
          "text",
          "text",
          "text",
          "text",
          "text",
          "text",
        ]}
        headings={[
          "Order No.",
          "Image",
          "Ship to",
          "Address",
          "Delivery",
          "Actions",
        ]}
        rows={rows}
        sortable={[false, true, false, false]}
        verticalAlign="middle"
        footerContent={
          total
            ? `Showing ${orders.length} of ${total} results`
            : `Showing ${orders.length} results`
        }
      />
    </Fragment>
  );
}


export default OrderTable;
