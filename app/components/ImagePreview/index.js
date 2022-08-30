import {
  Thumbnail,
} from "@shopify/polaris";

import { useState, useEffect } from "react";

const ImagePreview = ({
  src,
}) => {

  const [source, setSource] = useState(src);

  // Effects
  useEffect(() => {
    setSource(src);
  }, [src]);

  return (
    <div>
      <Thumbnail
        source={src}
        size="large"
      />
    </div>
    
  )
}

export default ImagePreview;