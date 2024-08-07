import { Link, useParams } from "@lumphammer/minirouter";
import React, { useContext } from "react";
import { FaArrowRight } from "react-icons/fa6";

import { ThemeContext } from "../../../themes/ThemeContext";
import { AsyncTextInput } from "../../inputs/AsyncTextInput";
import { GridField } from "../../inputs/GridField";
import { InputGrid } from "../../inputs/InputGrid";
import { SlideInNestedPanelRoute } from "../../nestedPanels/SlideInNestedPanelRoute";
import { DispatchContext } from "../contexts";
import { useStateSelector } from "../hooks";
import { store } from "../store";
import { CategoryDangerZone } from "./CategoryDangerZone";
import { cardCategory, categoryDangerZone } from "./directions";

export const Category: React.FC = () => {
  const id = useParams(cardCategory);
  const { value: category } = useStateSelector((s) =>
    s.settings.cardCategories.find((c) => c.id === id),
  );
  const dispatch = useContext(DispatchContext);
  const theme = useContext(ThemeContext);

  const handleNameChange = (newName: string) => {
    dispatch(store.creators.renameCardCategory({ id, newName }));
  };

  const handleCssClassChange = (newCssClass: string) => {
    dispatch(store.creators.setCardCategoryCssClass({ id, newCssClass }));
  };

  const shade1 = "#f002";
  const shade2 = "#f001";

  return (
    <>
      <h2>Card category</h2>
      <InputGrid>
        <GridField label="Item Name">
          <AsyncTextInput value={category?.name} onChange={handleNameChange} />
        </GridField>
        <GridField label="CSS Class">
          <AsyncTextInput
            value={category?.cssClass ?? ""}
            onChange={handleCssClassChange}
          />
        </GridField>
      </InputGrid>
      <p css={{ textAlign: "right" }}>
        <Link
          to={categoryDangerZone()}
          css={{
            verticalAlign: "middle",
            "&&": {
              color: theme.colors.danger,
            },
            // backgroundColor: "red",
          }}
        >
          <span css={{ verticalAlign: "top" }}>Danger Zone</span>
          {"   "}
          <FaArrowRight />
        </Link>
      </p>
      <SlideInNestedPanelRoute
        direction={categoryDangerZone}
        css={{
          background: `
          repeating-linear-gradient(135deg, ${shade1}, ${shade1} 30px, ${shade2} 10px, ${shade2} 60px),
          linear-gradient(135deg, ${theme.colors.bgOpaquePrimary}, ${theme.colors.bgOpaquePrimary} )
          `,
        }}
      >
        <CategoryDangerZone id={id} />
      </SlideInNestedPanelRoute>
    </>
  );
};

Category.displayName = "Category";
