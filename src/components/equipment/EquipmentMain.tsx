import React, { ChangeEvent, useCallback } from "react";

import { getTranslated } from "../../functions/getTranslated";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { settings } from "../../settings/settings";
import { assertEquipmentItem } from "../../v10Types";
import { absoluteCover } from "../absoluteCover";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { NotesEditorWithControls } from "../inputs/NotesEditorWithControls";
import { TextInput } from "../inputs/TextInput";
import { EquipmentField } from "./EquipmentField";

interface EquipmentMainProps {
  equipment: InvestigatorItem;
  name: string;
  onChangeName: (name: string) => void;
}

export const EquipmentMain: React.FC<EquipmentMainProps> = ({
  equipment,
  name,
  onChangeName,
}) => {
  assertEquipmentItem(equipment);

  const categories = settings.equipmentCategories.get();
  const categoryMetadata = categories[equipment.system.category];
  const isRealCategory = categoryMetadata !== undefined;

  const onChangeCategory = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      void equipment.setCategory(e.currentTarget.value);
    },
    [equipment],
  );

  const selectedCat = isRealCategory ? equipment.system.category : "";

  const fieldsLength = Object.keys(categoryMetadata?.fields ?? {}).length + 2;

  return (
    <InputGrid
      css={{
        gridTemplateRows: `repeat(${fieldsLength}, auto) 1fr`,
        ...absoluteCover,
      }}
    >
      <GridField label="Item Name">
        <TextInput value={name} onChange={onChangeName} />
      </GridField>

      <GridField label="Category">
        <div
          css={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div>
            <select
              value={selectedCat}
              onChange={onChangeCategory}
              css={{
                lineHeight: "inherit",
                height: "inherit",
              }}
            >
              {Object.entries(categories).map<JSX.Element>(([id, cat]) => (
                <option key={id} value={id}>
                  {cat.name}
                </option>
              ))}
              <option value="">{getTranslated("Uncategorized")}</option>
            </select>
          </div>
        </div>
      </GridField>

      {Object.entries(categoryMetadata?.fields ?? {}).map(
        ([fieldId, fieldMetadata]) => {
          return (
            <EquipmentField
              key={fieldId}
              fieldId={fieldId}
              fieldMetadata={fieldMetadata}
              value={equipment.system.fields?.[fieldId]}
              equipment={equipment}
            />
          );
        },
      )}

      <NotesEditorWithControls
        allowChangeFormat
        format={equipment.system.notes.format}
        html={equipment.system.notes.html}
        source={equipment.system.notes.source}
        onSave={equipment.setNotes}
      />
    </InputGrid>
  );
};

EquipmentMain.displayName = "EquipmentMain";
