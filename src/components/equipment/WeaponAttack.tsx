import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { generalAbility } from "../../constants";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { ThemeContext } from "../../themes/ThemeContext";
import {
  ActorPayload,
  assertWeaponItem,
  isAbilityItem,
  isPCActor,
} from "../../v10Types";
import { absoluteCover } from "../absoluteCover";
import { AsyncNumberInput } from "../inputs/AsyncNumberInput";
import { CheckButtons } from "../inputs/CheckButtons";
import { GridField } from "../inputs/GridField";
import { GridFieldStacked } from "../inputs/GridFieldStacked";
import { InputGrid } from "../inputs/InputGrid";
import { NotesEditorWithControls } from "../inputs/NotesEditorWithControls";
import { Translate } from "../Translate";
import { performAttack } from "./performAttack";

type WeaponAttackProps = {
  weapon: InvestigatorItem;
};

const defaultSpendOptions = new Array(8).fill(null).map((_, i) => {
  const label = i.toString();
  return { label, value: Number(label), enabled: true };
});

export const WeaponAttack: React.FC<WeaponAttackProps> = ({ weapon }) => {
  assertWeaponItem(weapon);
  const [spend, setSpend] = useState(0);
  const [bonusPool, setBonusPool] = useState(0);
  const theme = useContext(ThemeContext);

  const abilityName = weapon.system.ability;

  const ability: InvestigatorItem | undefined = weapon.actor?.items.find(
    (item: InvestigatorItem) => {
      return item.type === generalAbility && item.name === abilityName;
    },
  );

  const pool = ability && isAbilityItem(ability) ? ability.system.pool : 0;

  const spendOptions = defaultSpendOptions.map((option) => ({
    ...option,
    enabled: option.value <= pool + bonusPool,
  }));

  const basePerformAttack = useMemo(() => {
    return performAttack({
      spend,
      bonusPool,
      setSpend,
      setBonusPool,
      ability,
      weapon,
    });
  }, [ability, bonusPool, spend, weapon]);

  const onPointBlank = useCallback(() => {
    assertWeaponItem(weapon);
    void basePerformAttack({
      rangeName: "point blank",
      rangeDamage: weapon.system.pointBlankDamage,
    });
  }, [basePerformAttack, weapon]);

  const onCloseRange = useCallback(() => {
    assertWeaponItem(weapon);
    void basePerformAttack({
      rangeName: "close range",
      rangeDamage: weapon.system.closeRangeDamage,
    });
  }, [basePerformAttack, weapon]);

  const onNearRange = useCallback(() => {
    assertWeaponItem(weapon);
    void basePerformAttack({
      rangeName: "near range",
      rangeDamage: weapon.system.nearRangeDamage,
    });
  }, [basePerformAttack, weapon]);

  const onLongRange = useCallback(() => {
    assertWeaponItem(weapon);
    void basePerformAttack({
      rangeName: "long range",
      rangeDamage: weapon.system.longRangeDamage,
    });
  }, [basePerformAttack, weapon]);

  const weaponActor = weapon.actor;

  const [actorInitiativeAbility, setActorInitiativeAbility] = React.useState(
    weaponActor && isPCActor(weaponActor)
      ? weaponActor.system.initiativeAbility
      : "",
  );

  useEffect(() => {
    const callback = (
      actor: Actor,
      diff: ActorPayload,
      options: unknown,
      id: string,
    ) => {
      if (actor.id === weaponActor?.id) {
        setActorInitiativeAbility(
          weaponActor && isPCActor(weaponActor)
            ? weaponActor.system.initiativeAbility
            : "",
        );
      }
    };
    Hooks.on("updateActor", callback);
    return () => {
      Hooks.off("updateActor", callback);
    };
  }, [weaponActor]);

  const isAbilityUsed = actorInitiativeAbility === ability?.name;
  const onClickUseForInitiative = useCallback(
    (e: React.MouseEvent) => {
      if (ability) {
        void weapon.actor?.update({
          system: {
            initiativeAbility: ability.name || "",
          },
        });
      }
    },
    [ability, weapon.actor],
  );

  const ammoFail = weapon.system.usesAmmo && weapon.system.ammo.value <= 0;

  return (
    <div css={{ ...absoluteCover, display: "flex", flexDirection: "column" }}>
      <InputGrid
        className={theme.panelClass}
        css={{
          padding: "1em",
          marginBottom: "0.5em",
          ...theme.panelStyleSecondary,
        }}
      >
        <GridField label="Spend">
          <CheckButtons
            onChange={setSpend}
            selected={spend}
            options={spendOptions}
          />
        </GridField>
        <GridFieldStacked>
          <div
            css={{
              display: "flex",
              flexDirection: "row",
              position: "relative",
            }}
          >
            {ammoFail && (
              <div
                css={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "1.2em",
                  backgroundColor: theme.colors.accentContrast,
                  color: theme.colors.accent,
                  padding: "0 1em",
                }}
              >
                <Translate>Out of ammo</Translate>
              </div>
            )}
            <button
              css={{ lineHeight: 1, flex: 1 }}
              disabled={ammoFail || !weapon.system.isPointBlank}
              onClick={onPointBlank}
            >
              <Translate>Point Blank</Translate>
            </button>
            <button
              css={{ lineHeight: 1, flex: 1 }}
              disabled={ammoFail || !weapon.system.isCloseRange}
              onClick={onCloseRange}
            >
              <Translate>Close Range</Translate>
            </button>
            <button
              css={{ lineHeight: 1, flex: 1 }}
              disabled={ammoFail || !weapon.system.isNearRange}
              onClick={onNearRange}
            >
              <Translate>Near Range</Translate>
            </button>
            <button
              css={{ lineHeight: 1, flex: 1 }}
              disabled={ammoFail || !weapon.system.isLongRange}
              onClick={onLongRange}
            >
              <Translate>Long Range</Translate>
            </button>
          </div>
        </GridFieldStacked>
      </InputGrid>
      <InputGrid
        css={{
          flex: 1,
          gridTemplateRows: `${weapon.system.usesAmmo ? "auto " : ""}1fr`,
        }}
      >
        {weapon.system.usesAmmo && (
          <GridField label="Ammo">
            <div
              css={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <button
                css={{
                  flexBasis: "min-content",
                  flex: 0,
                  lineHeight: "inherit",
                }}
                onClick={weapon.reload}
              >
                <Translate>Reload</Translate>
              </button>
              <AsyncNumberInput
                css={{ flex: 1 }}
                min={0}
                max={weapon.system.ammo.max}
                value={weapon.system.ammo.value}
                onChange={weapon.setAmmo}
              />
            </div>
          </GridField>
        )}

        <NotesEditorWithControls
          allowChangeFormat
          format={weapon.system.notes.format}
          html={weapon.system.notes.html}
          source={weapon.system.notes.source}
          onSave={weapon.setNotes}
        />
        <GridField label="Bonus pool">
          <AsyncNumberInput onChange={setBonusPool} value={bonusPool} />
        </GridField>
        <GridField noTranslate label={abilityName}>
          <a onClick={() => ability?.sheet?.render(true)}>
            <Translate values={{ AbilityName: ability?.name ?? "" }}>
              Open (ability name) ability
            </Translate>
          </a>
        </GridField>
        <GridField label="">
          {isAbilityUsed ? (
            <i>
              <Translate>
                This ability is currently being used for combat ordering
              </Translate>
            </i>
          ) : (
            <span>
              <a onClick={onClickUseForInitiative}>
                <Translate values={{ AbilityName: ability?.name ?? "" }}>
                  Use (ability name) for combat ordering
                </Translate>
              </a>{" "}
              (
              {actorInitiativeAbility ? (
                <Translate values={{ AbilityName: actorInitiativeAbility }}>
                  Currently using (ability name)
                </Translate>
              ) : (
                <Translate>Currently using nothing</Translate>
              )}
              )
            </span>
          )}
        </GridField>
        <GridField label="Cost">
          <AsyncNumberInput
            min={0}
            value={weapon.system.cost}
            onChange={weapon.setCost}
          />
        </GridField>
      </InputGrid>
    </div>
  );
};
