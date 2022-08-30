import { useState, useEffect, Fragment, useCallback } from "react";
import OrderService from "../../../services/OrderService";

import {
  Card,
  IndexTable,
  TextStyle,
  TextField,
  Filters,
  Select,
  Badge,
  Tooltip,
  Button,
  useIndexResourceState,
  Pagination
} from "@shopify/polaris";

import { EditMajor, PrintMinor, LinkMinor } from "@shopify/polaris-icons";

import Router from "next/router";


function OrderList({ orders, onPrint, onPrintSlips, meta, onPageChange, onSortChange, openNewTab,customNewTab }) {

  const months = {1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'};
  const format = (datetime) => {
    const [date, time] = datetime.split('T');
    const [y, m, d] = date.match(/\d+/g);
    const [t, tz] = time.split(/(?=[+-])/);
    return `${m}/${d}/${y} ${t}`;
  };

  let allOrders = [];
  orders.forEach(order => {

    let delivery;
    if(order.delivery){
      if(order.delivery == "asap"){
        delivery = "ASAP";
      }else{
        let dt = "Not set";
        if(order.arriveByDate != undefined){
          dt = format(order.arriveByDate);
        }

        // let date = new Date(order.arriveByDate);
        // delivery = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        delivery = dt;
      }
    }else{
      delivery = "Not defined";
    }

    let orderName = order.orderName;
    let orderId = order.orderId;
   console.log('here printPdf', order.printPdf);
    let orderObj = {
      id: order._id,
      orderId: orderId,
      printPdf: order.printPdf,
      orderName: order.orderName,
      orderNameUpdate: orderName,
      customer: order.firstName + " " + order.lastName,
      address: order.deliverTo,
      shipDate: delivery,
      message: order.message,
      font: order.font,
      design: order.design,
      status: order.status == "fulfilled" ? "Printed" : "Unprinted",
    }

    allOrders.push(orderObj);
  });


  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
  } = useIndexResourceState(allOrders);
  const [taggedWith, setTaggedWith] = useState(null);
  const [queryValue, setQueryValue] = useState(null);
  const [sortValue, setSortValue] = useState('status_fulfilled');

  useEffect(() => {
  });

  const rowMarkup = allOrders.map(
    ({orderName, orderNameUpdate, customer, shipDate, status, address, id, order, orderId, message, font, design, printPdf}, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell style={{position: "relative"}}>
          {orderNameUpdate}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <p><strong>{customer}  </strong></p>
          <p>{address}</p>

        </IndexTable.Cell>
        <IndexTable.Cell>{shipDate}</IndexTable.Cell>
        <IndexTable.Cell><Badge status={status == "Printed" ? "success" : "new"}>{status}</Badge></IndexTable.Cell>
        <IndexTable.Cell>
          <Tooltip content="Edit">
            <Button
              size="slim"
              icon={EditMajor}
              plain
              onClick={() =>
                Router.push({
                  pathname: "/orders/edit",
                  query: { id: id, order: JSON.stringify({orderName, customer, shipDate, status, address, id, order, orderId, message, font, design}) },
                })
              }
            ></Button>
          </Tooltip>
         

          <Tooltip content="Print able Pdf">
            <Button
              size="slim"
              icon={PrintMinor}
              plain
              onClick={async() => {
                  // customNewTab(`${printPdf}`) 
                  try {
                    console.log('order id click print icon','==========',id)
                    let isPdficon = 'true';
                    const data = await OrderService.printCard(id,isPdficon);
                    console.log({data: data});
                    customNewTab(`/public/widget/generatedPdfs/${data.data.payload.file}`) ;
                  } catch (error) {
                    alert(error.message);
                  }
                }
                
              }
            ></Button>
          </Tooltip>

          <Tooltip content="Open order">
            <Button
              size="slim"
              icon={LinkMinor}
              plain
              onClick={() => openNewTab(`admin/orders/${orderId}`) }
            ></Button>
          </Tooltip>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  const resourceName = {
    singular: 'customer',
    plural: 'customers',
  };

  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    [],
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
  const handleClearAll = useCallback(() => {
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleTaggedWithRemove]);
  const handleSortChange = useCallback((value) => {
    setSortValue(value);
    onSortChange(1, value)
  }, []);

  const promotedBulkActions = [
    {
      content: 'Generate Print File',
      onAction: () => onPrint(selectedResources),
    },
  ];
  const bulkActions = [
    {
      content: 'Print packaging slips',
      onAction: () => onPrintSlips(selectedResources),
    }
  ];

  const filters = [
    {
      key: 'taggedWith',
      label: 'Tagged with',
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          labelHidden
        />
      ),
      shortcut: true,
    },
  ];

  const appliedFilters = !isEmpty(taggedWith)
    ? [
        {
          key: 'taggedWith',
          label: disambiguateLabel('taggedWith', taggedWith),
          onRemove: handleTaggedWithRemove,
        },
      ]
    : [];

  const sortOptions = [
    
    {label: 'Status Unprinted', value: 'status_fulfilled'},
    {label: 'Status Printed', value: 'status_unfulfilled'},
  ];

  return (
    <Card>
      <div style={{padding: '16px', display: 'flex', justifyContent: 'end'}}>
        <div style={{paddingLeft: '0.4rem'}}>
          <Select
            labelInline
            label="Sort by"
            options={sortOptions}
            value={sortValue}
            onChange={handleSortChange}
          />
        </div>
      </div>
      <IndexTable
        resourceName={resourceName}
        itemCount={allOrders.length}
        selectedItemsCount={
          allResourcesSelected ? 'All' : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        hasMoreItems
        bulkActions={bulkActions}
        promotedBulkActions={promotedBulkActions}
        headings={[
          {title: 'Order'},
          {title: 'Customer / Shipping Address'},
          {title: 'Order Date'},
          {title: 'Status'},
          {title: 'Actions'},
        ]}
      >
        {rowMarkup}
      </IndexTable>
      <Pagination
        hasPrevious={meta.page != "1"}
        onPrevious={() => {
          onPageChange(parseInt(meta.page) - 1, sortValue)
        }}
        hasNext={meta.pages != parseInt(meta.page)}
        onNext={() => {
          onPageChange(parseInt(meta.page) + 1, sortValue)
        }}
      />
    </Card>
  );

  function disambiguateLabel(key, value) {
    switch (key) {
      case 'taggedWith':
        return `Tagged with ${value}`;
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '' || value == null;
    }
  }
}

export default OrderList;
