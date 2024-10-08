import React, { ReactNode, useContext } from "react";

import { InvestigatorItem } from "../../module/InvestigatorItem";
import { ThemeContext } from "../../themes/ThemeContext";
import { assertAbilityItem, isGeneralAbilityItem } from "../../v10Types";
import { Translate } from "../Translate";
import { SituationalModifierBadge } from "./SituationalModifierBadge";

interface UnlockBadgesProps {
  ability: InvestigatorItem;
  className?: string;
}

export const AbilityBadges: React.FC<UnlockBadgesProps> = ({
  ability,
  className,
}: UnlockBadgesProps) => {
  assertAbilityItem(ability);
  const situationalModifiers = ability.getVisibleSituationalModifiers();
  const unlocks = ability.getActiveUnlocks();
  const theme = useContext(ThemeContext);
  return (
    <div
      className={className}
      css={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "end",
        flexWrap: "wrap",
        marginBottom: unlocks.length > 0 ? "0.25em" : undefined,
      }}
    >
      {/* Boost */}
      {ability.system.boost && (
        <Translate
          css={{
            background: theme.colors.accentContrast,
            color: theme.colors.accent,
            outline: `1px solid ${theme.colors.accent}`,
            fontSize: "0.9em",
            lineHeight: "1",
            borderRadius: "0.5em",
            padding: "0 0.5em",
            margin: "0 0.25em",
          }}
        >
          Boosted
        </Translate>
      )}

      {/* Push pool */}
      {isGeneralAbilityItem(ability) && ability.system.isPushPool && (
        <Translate
          css={{
            background: theme.colors.accentContrast,
            color: theme.colors.accent,
            outline: `1px solid ${theme.colors.accent}`,
            fontSize: "0.9em",
            lineHeight: "1",
            borderRadius: "0.5em",
            padding: "0 0.5em",
            margin: "0 0.25em",
          }}
        >
          Push Pool
        </Translate>
      )}

      {/* Unlocks */}
      {unlocks.map<ReactNode>(({ description }, i) => {
        return (
          <span
            key={i}
            css={{
              background: theme.colors.accent,
              color: theme.colors.accentContrast,
              fontSize: "0.9em",
              lineHeight: "1",
              borderRadius: "0.5em",
              padding: "0 0.5em",
              margin: "0 0.25em",
            }}
          >
            {description}
          </span>
        );
      })}

      {situationalModifiers.map<ReactNode>((situationalModifer) => {
        return (
          <SituationalModifierBadge
            key={situationalModifer.id}
            situationalModifier={situationalModifer}
            ability={ability}
          />
        );
      })}
    </div>
  );
};

AbilityBadges.displayName = "AbilityBadges";
