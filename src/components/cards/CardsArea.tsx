import { createDirection, Router } from "@lumphammer/minirouter";
import React, { useCallback, useEffect, useState } from "react";

import { confirmADoodleDo } from "../../functions/confirmADoodleDo";
import { getTranslated } from "../../functions/getTranslated";
import { sortEntitiesByName } from "../../functions/utilities";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { assertPCActor, isCardItem } from "../../v10Types";
import { absoluteCover } from "../absoluteCover";
import { Button } from "../inputs/Button";
import { ArrowLink } from "../nestedPanels/ArrowLink";
import { SlideInNestedPanelRoute } from "../nestedPanels/SlideInNestedPanelRoute";
import { CardsAreaSettingsSheet } from "./CardsAreaSettings";
import { CategorizedCardArray } from "./CategorizedCardArray";
import { CardsAreaSettingsContext } from "./contexts";
import { CardsAreaSettings } from "./types";
import { UncategorizedCardArray } from "./UncategorizedCardArray";

interface CardsAreaProps {
  actor: InvestigatorActor;
}

const settingsDirection = createDirection("settings");

export const CardsArea: React.FC<CardsAreaProps> = ({ actor }) => {
  assertPCActor(actor);
  const allCards = actor.items.filter((item) => isCardItem(item));

  // local settings state for rapid updates
  const [cardsAreaSettings, setCardsAreaSettings] = useState<CardsAreaSettings>(
    actor.system.cardsAreaSettings,
  );

  // keep local state in sync with the actor
  useEffect(() => {
    void setCardsAreaSettings({
      category: actor.system.cardsAreaSettings.category,
      sortOrder: actor.system.cardsAreaSettings.sortOrder,
      viewMode: actor.system.cardsAreaSettings.viewMode,
      columnWidth: actor.system.cardsAreaSettings.columnWidth,
    });
  }, [
    actor.system.cardsAreaSettings.category,
    actor.system.cardsAreaSettings.sortOrder,
    actor.system.cardsAreaSettings.viewMode,
    actor.system.cardsAreaSettings.columnWidth,
  ]);

  // update local state and the actor
  const updateCardsAreaSettings = useCallback(
    (update: Partial<CardsAreaSettings>) => {
      setCardsAreaSettings((current: CardsAreaSettings) => {
        const newSettings = {
          ...current,
          ...update,
        };
        // update the actor in the background
        void actor.setCardsAreaSettings(newSettings);
        return newSettings;
      });
    },
    [actor],
  );

  const handleClickCreateCard = useCallback(() => {
    void actor.createCard();
  }, [actor]);

  const handleClickEndScenario = useCallback(async () => {
    const cardsCount = actor.getNonContinuityCards().length;
    const yes = await confirmADoodleDo({
      message: "EndScenarioDiscardCountNonContinuityCards",
      confirmText: "EndScenario",
      cancelText: "Cancel",
      confirmIconClass: "fa-fire",
      resolveFalseOnCancel: true,
      values: {
        ActorName: actor.name ?? "",
        Count: cardsCount,
      },
    });
    if (yes) {
      void actor.endScenario();
    }
  }, [actor]);

  let cards =
    cardsAreaSettings.sortOrder === "atoz" ||
    cardsAreaSettings.sortOrder === "ztoa"
      ? sortEntitiesByName(allCards)
      : allCards;

  if (
    cardsAreaSettings.sortOrder === "newest" ||
    cardsAreaSettings.sortOrder === "ztoa"
  ) {
    cards = cards.reverse();
  }

  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <CardsAreaSettingsContext.Provider value={cardsAreaSettings}>
      <Router>
        <div
          css={{
            ...absoluteCover,
            display: "flex",
            flexDirection: "column",
            padding: "0.5em",
          }}
        >
          <div
            css={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "end",
              flexDirection: "row",
              gap: "0.5em",
            }}
          >
            <Button onClick={handleClickCreateCard}>
              {getTranslated("Create card")}
            </Button>
            <Button onClick={handleClickEndScenario}>
              {getTranslated("End scenario")}
            </Button>
            <div css={{ flex: 1 }} />
            <ArrowLink to={settingsDirection()}>Settings</ArrowLink>
          </div>
          <div
            className="container-ref-haver"
            ref={containerRef}
            css={{
              flex: 1,
              overflow: "auto",
            }}
          >
            {cardsAreaSettings.category === "categorized" ? (
              <CategorizedCardArray cards={cards} />
            ) : (
              <UncategorizedCardArray cards={cards} />
            )}
          </div>
        </div>
        <SlideInNestedPanelRoute
          margin={"10em"}
          direction={settingsDirection}
          css={{ display: "flex", flexDirection: "column" }}
          closeOnClickOutside
        >
          <CardsAreaSettingsSheet
            settings={cardsAreaSettings}
            onChangeSettings={updateCardsAreaSettings}
          />
        </SlideInNestedPanelRoute>
      </Router>
    </CardsAreaSettingsContext.Provider>
  );
};
//
