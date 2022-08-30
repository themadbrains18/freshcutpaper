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

const QuoteForm = ({
  data,
  allOccasions,
  onUpdate,
}) => {
  const [quote, setQuote] = useState(data);
  const [occasions, setOccasions] = useState(allOccasions);

  const handleTitleChange = useCallback(
    (title) =>
    setQuote((prevState) => {
        return { ...prevState, title };
      }),
    []
  );

  const handleOccasionChange = useCallback(
    (occasion) =>
    setQuote((prevState) => {
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
    onUpdate({ quote });
  }, [quote]);

  return (
    <div>
      <Form>
        <FormLayout>
          <TextField
            label="Card Title"
            value={quote.title}
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
            value={quote.occasion}
            onChange={handleOccasionChange}
          />
          <TextField
            label="Quote"
            value={quote.quote}
            onChange={handleQuoteChange}
            multiline={6}
          />
        </FormLayout>
      </Form>
    </div>
  )
}

export default QuoteForm;
