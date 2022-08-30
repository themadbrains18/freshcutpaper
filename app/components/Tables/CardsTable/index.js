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

const CardTable = ({ cards, onDelete, total, meta, onPageChange }) => {
  const [rows, setRows] = useState([]);

  const handleRemoveItem = (item) => {
    onDelete ? onDelete(item) : {};
  }

  useEffect(() => {
    const tableCards = cards.map((card) => {
        return [
          <Thumbnail
            source={card.image_url}
          />,
          <Link
            onClick={() =>
              Router.push({
                pathname:`/cards/edit`,
                query: { id: card._id, cardDesign: JSON.stringify(card) },
              })
            }
          >
            {card.title}
          </Link>,
          card.character_count,
          <ButtonGroup>
            <Tooltip content="Edit">
              <Button
                size="slim"
                icon={EditMajor}
                plain
                onClick={() =>
                  Router.push({
                    pathname: "/cards/edit",
                    query: { id: card._id, cardDesign: JSON.stringify(card) },
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
                onClick={() => handleRemoveItem(card)}
              ></Button>
            </Tooltip>
          </ButtonGroup>
        ]
    });

    setRows(tableCards);
  }, [cards])

  return (
    
    <Fragment>
      <DataTable
        columnContentTypes={[
          "text",
          "text",
          "text",
          "text",
        ]}
        headings={[
          "Image",
          "Title",
          "Max lines",
          "Actions",
        ]}
        rows={rows}
        sortable={[false, true, false, false]}
        verticalAlign="middle"
        footerContent={
          total
            ? `Showing ${cards.length} of ${total} results`
            : `Showing ${cards.length} results`
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


export default CardTable;
