import { useCallback, useContext } from "react";

import { useDocumentSheetContext } from "../../hooks/useSheetContexts";
import { ThemeContext } from "../../themes/ThemeContext";
import { absoluteCover } from "../absoluteCover";
import Cross from "./no_image_cross.svg?react";

interface ImageAreaProps {
  page: any;
}

/**
 * A basic image page. Delegates to Foundry's native editor to do the heavy
 * lifting.
 */
export const ImageArea = ({ page }: ImageAreaProps) => {
  const theme = useContext(ThemeContext);

  const { app } = useDocumentSheetContext(page);

  const handleClickImage = useCallback(() => {
    // page.sheet.render(true);
    const fp = new FilePicker({
      type: "image",
      current: page.src ?? undefined,
      callback: (path: string) => {
        void page.update({
          src: path,
        });
      },
      top: (app.position.top ?? 0) + 40,
      left: (app.position.left ?? 0) + 10,
    });
    return fp.browse(page.src ?? "");
  }, [app.position.left, app.position.top, page]);

  return (
    <div
      data-testid="image-container"
      css={{
        position: "relative",
        textAlign: "center",
      }}
    >
      <a
        css={{
          margin: "auto",
          ...absoluteCover,
        }}
        onClick={handleClickImage}
      >
        {page.src ? (
          <img
            css={{
              cursor: "pointer",
              ":hover": {
                opacity: 0.5,
              },
              maxWidth: "100%",
              maxHeight: "100%",
            }}
            src={page.src}
          />
        ) : (
          <div
            css={{
              ...absoluteCover,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              ":hover": {
                backgroundColor: theme.colors.backgroundButton,
              },
            }}
          >
            <div
              css={{
                fontSize: "1.5em",
                color: theme.colors.text,
                padding: "1em",
                background: theme.colors.backgroundButton,
                borderRadius: "0.5em",
              }}
            >
              Click to add image
            </div>
            <Cross
              preserveAspectRatio="none"
              style={{
                color: "#0003",
                position: "absolute",
                top: "0%",
                left: "0%",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        )}
      </a>
    </div>
  );
};

ImageArea.displayName = "ImageArea";
