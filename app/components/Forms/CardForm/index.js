import {
  Banner,
  Button,
  Form,
  FormLayout,
  TextField,
  Select,
  Spinner,
} from "@shopify/polaris";

import { Fragment, useState, useEffect, useCallback } from "react";

import ImagePreview from "../../ImagePreview";

const CardForm = ({
  data,
  allOccasions,
  onUpdate,
}) => {
  const [card, setCard] = useState(data);
  const [occasions, setOccasions] = useState(allOccasions);

  const handleTitleChange = useCallback(
    (title) =>
      setCard((prevState) => {
        return { ...prevState, title };
      }),
    []
  );

  const handleImageChange = useCallback(
    (image_url) =>
      setCard((prevState) => {
        return { ...prevState, image_url };
      }),
    []
  );

  const handleCharacterChange = useCallback(
    (character_count) =>
      setCard((prevState) => {
        return { ...prevState, character_count };
      }),
    []
  );

  const handleIdChange = useCallback(
    (product_id) =>
      setCard((prevState) => {
        return { ...prevState, product_id };
      }),
    []
  );

  const handleOccasionChange = useCallback(
    (occasion) =>
    setCard((prevState) => {
        return { ...prevState, occasion };
      }),
    []
  );

  const handleQuoteChange = useCallback(
    (quote) =>
    setQuote((prevState) => {
        return { ...prevState, quote };
      }),
    []
  );

  useEffect(() => {
    onUpdate({ card });
  }, [card]);

  return (
    <div>
      <Form>
        <FormLayout>
          <TextField
            label="Card Title"
            value={card.title}
            maxLength={25}
            helpText="* Max 25 characters"
            showCharacterCount
            onChange={handleTitleChange}
          />
          <Select
            id="occasion"
            label="Occasion"
            placeholder="Select"
            options={occasions}
            value={card.occasion}
            onChange={handleOccasionChange}
          />
          <TextField
            label="Associated product ID"
            value={card.product_id}
            helpText="Leave empty if this card is not associated with specific product"
            onChange={handleIdChange}
          />
          <FormLayout.Group>
            <ImagePreview
              src={card.image_url}
            />
            <TextField
              label="Image URL"
              value={card.image_url}
              helpText='You can upload images using Shopify "Files" in "Setings -> Files" and copy URL'
              onChange={handleImageChange}
            />
          </FormLayout.Group>
          <TextField
            label="Max Line Count"
            type="number"
            value={card.character_count}
            onChange={handleCharacterChange}
          />
        </FormLayout>
      </Form>
    </div>
  )
}

export default CardForm;
