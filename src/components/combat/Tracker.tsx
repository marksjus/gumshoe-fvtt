/** @jsx jsx */
import { cx } from "@emotion/css";
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback, MouseEvent, ReactNode } from "react";
import { assertGame, assertNotNull } from "../../functions";
import { useRefStash } from "../../hooks/useRefStash";
import { settings } from "../../settings";
import { CombatantRow } from "./CombatantRow";
import { getTurns } from "./getTurns";

export const Tracker: React.FC = () => {
  assertGame(game);
  assertNotNull(game.user);

  // STATE & DERIVED DATA

  const combat = game.combats?.active;
  const combatId = combat?.data._id;
  const combatRef = useRefStash(combat);
  const combatCount = game.combats?.combats.length ?? 0;

  const combatIndex = combatId
    ? game.combats?.combats.findIndex((c) => c.data._id === combatId)
    : undefined;
  const previousId =
    combatIndex !== undefined && combatIndex > 0
      ? game.combats?.combats[combatIndex - 1].data._id
      : null;
  const nextId =
    combatIndex !== undefined && combatIndex < combatCount - 1
      ? game.combats?.combats[combatIndex + 1].data._id
      : null;

  const linked = combat?.data.scene !== null;
  const hasCombat = !!combat;

  const scopeLabel = game.i18n.localize(
    `COMBAT.${linked ? "Linked" : "Unlinked"}`,
  );

  const isTurnPassing = settings.useTurnPassingInitiative.get();

  // CALLBACKS

  const onCombatCreate = useCallback(async (event: MouseEvent) => {
    assertGame(game);
    event.preventDefault();
    const scene = game.scenes?.current;
    const cls = getDocumentClass("Combat");
    const combat = await cls.create({ scene: scene?.id });
    await combat?.activate({ render: false });
  }, []);

  const showConfig = useCallback((ev: MouseEvent) => {
    ev.preventDefault();
    // @ts-expect-error CombatTrackerConfig is fine with no args
    new CombatTrackerConfig().render(true);
  }, []);

  const onCombatCycle = useCallback(async (event) => {
    assertGame(game);
    event.preventDefault();
    const btn = event.currentTarget;
    const combat = game.combats?.get(btn.dataset.combatId);
    if (!combat) return;
    await combat.activate({ render: false });
  }, []);

  const onDeleteCombat = useCallback(
    async (event: MouseEvent) => {
      event.preventDefault();
      combatRef.current?.delete();
    },
    [combatRef],
  );

  const onToggleSceneLink = useCallback(
    async (event: MouseEvent) => {
      event.preventDefault();
      combatRef.current?.toggleSceneLink();
    },
    [combatRef],
  );

  const onPreviousRound = useCallback((event: MouseEvent) => {
    event.preventDefault();
    combatRef.current?.previousRound();
  }, [combatRef]);

  const onPreviousTurn = useCallback((event: MouseEvent) => {
    event.preventDefault();
    combatRef.current?.previousTurn();
  }, [combatRef]);

  const onEndCombat = useCallback((event: MouseEvent) => {
    event.preventDefault();
    combatRef.current?.endCombat();
  }, [combatRef]);

  const onNextTurn = useCallback((event: MouseEvent) => {
    event.preventDefault();
    combatRef.current?.nextTurn();
  }, [combatRef]);

  const onNextRound = useCallback((event: MouseEvent) => {
    event.preventDefault();
    combatRef.current?.nextRound();
  }, [combatRef]);

  const onStartCombat = useCallback((event: MouseEvent) => {
    event.preventDefault();
    combatRef.current?.startCombat();
  }, [combatRef]);

  const localize = game.i18n.localize.bind(game.i18n);

  if (combat === null) {
    return null;
  }

  // foundry's native combat tracker uses these things called "turns" which are
  // kinda pre-baked data for the rows in the tracker - each one corresponds to
  // a combatant in the combat
  const turns = combat ? getTurns(combat) : [];

  // if (combat === null || combat === undefined) {
  //   return null;
  // }

  return (
    <Fragment>
      {/* TOP ROW: + < Encounter 2/3 > X */}
      <header id="combat-round">
        {game.user.isGM && (
          <nav className="encounters flexrow">
            <a
              className="combat-create"
              title={localize("COMBAT.Create")}
              onClick={onCombatCreate}
            >
              <i className="fas fa-plus"></i>
            </a>
            {combatCount > 0 && (
              <Fragment>
                <a
                  className="combat-cycle"
                  title={localize("COMBAT.EncounterPrevious")}
                  {...(previousId
                    ? { "data-combat-id": previousId }
                    : { disabled: true })}
                  onClick={onCombatCycle}
                >
                  <i className="fas fa-caret-left"></i>
                </a>
                <h4 className="encounter">
                  {localize("COMBAT.Encounter")} {(combatIndex ?? 0) + 1} /{" "}
                  {combatCount}
                </h4>
                <a
                  className="combat-cycle"
                  title={localize("COMBAT.EncounterNext")}
                  {...(nextId
                    ? { "data-combat-id": nextId }
                    : { disabled: true })}
                    onClick={onCombatCycle}
                    >
                  <i className="fas fa-caret-right"></i>
                </a>
              </Fragment>
            )}
            {
              combatCount > 0 &&
              <a
                className="combat-control"
                title={localize("COMBAT.Delete")}
                onClick={onDeleteCombat}
              >
                <i className="fas fa-trash"></i>
              </a>
            }
          </nav>
        )}

        {/* SECOND ROW: RoUnD 4, link, cog */}
        <nav
          className={cx({ encounters: true, flexrow: true, combat: hasCombat })}
        >
          <a className="combat-control"/>
          {combatCount
            ? (
            <Fragment>
              {combat?.data.round
                ? (
                <h3 className="encounter-title">
                  {localize("COMBAT.Round")} {combat.data.round}
                </h3>
                  )
                : (
                <h3 className="encounter-title">
                  {localize("COMBAT.NotStarted")}
                </h3>
                  )}
            </Fragment>
              )
            : (
            <h3 className="encounter-title">{localize("COMBAT.None")}</h3>
              )}

          {game.user.isGM && (
            <Fragment>
              <a
                className="combat-control"
                // @ts-expect-error foundry uses non-standard "disabled"
                disabled={!hasCombat}
                title={scopeLabel}
                onClick={onToggleSceneLink}
              >
                <i
                  className={cx({
                    fas: true,
                    "fa-link": linked,
                    "fa-unlink": !linked,
                  })}
                />
              </a>
              <a
                className="combat-settings"
                title={localize("COMBAT.Settings")}
                // data-control="trackerSettings"
                onClick={showConfig}
              >
                <i className="fas fa-cog"></i>
              </a>
            </Fragment>
          )}
        </nav>
      </header>

      {/* ACTUAL COMBATANTS, or "turns" in early-medieval foundry-speak */}
      <ol id="combat-tracker" className="directory-list">
        {
          turns.map<ReactNode>((turn, i) => (
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            <CombatantRow key={i} turn={turn} combat={combat!} />
          ))
        }
      </ol>

      {/* BOTTOM BITS: |< < End combat > >| */}
      {!isTurnPassing &&
        <nav id="combat-controls" className="directory-footer flexrow">
          {(hasCombat && !isTurnPassing) &&
            (game.user.isGM
              ? (
              <Fragment>
                {combat.data.round
                  ? (
                  <Fragment>
                    <a
                      title={localize("COMBAT.RoundPrev")}
                      onClick={onPreviousRound}
                    >
                      <i className="fas fa-step-backward"></i>
                    </a>
                    <a
                      title={localize("COMBAT.TurnPrev")}
                      onClick={onPreviousTurn}
                    >
                      <i className="fas fa-arrow-left"></i>
                    </a>
                    <a
                      className="center"
                      title={localize("COMBAT.End")}
                      onClick={onEndCombat}
                    >
                      {localize("COMBAT.End")}
                    </a>
                    <a
                      title={localize("COMBAT.TurnNext")}
                      onClick={onNextTurn}
                    >
                      <i className="fas fa-arrow-right"></i>
                    </a>
                    <a
                      title={localize("COMBAT.RoundNext")}
                      onClick={onNextRound}
                    >
                      <i className="fas fa-step-forward"></i>
                    </a>
                  </Fragment>
                    )
                  : (
                  <a
                    className="combat-control center"
                    title={localize("COMBAT.Begin")}
                    onClick={onStartCombat}
                  >
                    {localize("COMBAT.Begin")}
                  </a>
                    )}
              </Fragment>
                )
              : (
                  game.user &&
              combat.combatant?.players?.includes(game.user) && (
                <Fragment>
                  <a
                    className="combat-control"
                    title={localize("COMBAT.TurnPrev")}
                    onClick={onPreviousTurn}
                  >
                    <i className="fas fa-arrow-left"></i>
                  </a>
                  <a
                    className="combat-control center"
                    title={localize("COMBAT.TurnEnd")}
                    onClick={onNextTurn}
                  >
                    {localize("COMBAT.TurnEnd")}
                  </a>
                  <a
                    className="combat-control"
                    title={localize("COMBAT.TurnNext")}
                    onClick={onNextTurn}
                  >
                    <i className="fas fa-arrow-right"></i>
                  </a>
                </Fragment>
                  )
                ))}
        </nav>
      }
    </Fragment>
  );
};