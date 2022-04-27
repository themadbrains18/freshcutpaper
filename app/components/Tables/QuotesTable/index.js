import { useState, useEffect, Fragment } from "react";
import {
  DataTable,
  ButtonGroup,
  Tooltip,
  Button,
  Link,
  Badge,
  Thumbnail,
  Pagination
} from "@shopify/polaris";

import { EditMajor, DeleteMajor } from "@shopify/polaris-icons";

import Router from "next/router";

const QuoteTable = ({ quotes, onDelete, total, meta, onPageChange }) => {
  const [rows, setRows] = useState([]);

  const handleRemoveItem = (item) => {
    onDelete ? onDelete(item) : {};
  }

  useEffect(() => {
    const tableQuotes = quotes.map((quote) => {
      let quotetext = quote.quote;
      if (quotetext.length > 50) {
        quotetext =  quotetext.substring(0, 50) + '...';
     }
      return [
        quote.occasion,
        quotetext,
        <ButtonGroup>
        <Tooltip content="Edit">
          <Button
            size="slim"
            icon={EditMajor}
            plain
            onClick={() =>
              Router.push({
                pathname: "/quotes/edit",
                query: { id: "quote._id", quote: JSON.stringify(quote) },
              })
            }
          ></Button>
        </Tooltip>
        <Tooltip content="Remove">
          <Button
            size="slim"
            icon={DeleteMajor}
            plain
            destructive
            onClick={() => handleRemoveItem(quote)}
          ></Button>
        </Tooltip>
      </ButtonGroup>
      ]
    });

    setRows(tableQuotes);
  }, [quotes])

  return (
    <Fragment>
      <DataTable
        columnContentTypes={[
          "text",
          "text",
          "text",
        ]}
        headings={[
          "Occasion",
          "Quote",
          "Actions"
        ]}
        rows={rows}
        sortable={[true, false]}
        verticalAlign="middle"
        footerContent={
          total
            ? `Showing ${quotes.length} of ${total} results`
            : `Showing ${quotes.length} results`
        }
      />
       <Pagination
        hasPrevious={meta.page != "1"}
        onPrevious={() => {
          onPageChange(parseInt(meta.page) - 1)
        }}
        hasNext={meta.pages != parseInt(meta.page)}
        onNext={() => {
          onPageChange(parseInt(meta.page) + 1)
        }}
      />
    </Fragment>
  );
}


export default QuoteTable;
