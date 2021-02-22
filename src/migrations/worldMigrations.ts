import * as constants from "../constants";

/**
 * we added generalAbilityCategories, which necessitates renaming the old
 * abilityCategories to investigativeAbilityCategories
 */
export const migrateAbilityCategories = async () => {
  // this is also checked at the call site but belt & braces.
  if (!game.user.isGM) return;
  const oldCats = game.settings.get(constants.systemName, constants.abilityCategories);
  if (oldCats) {
    ui.notifications.info("Converting legacy ability categories to investigative ability categories.", { });
    await game.settings.set(constants.systemName, constants.investigativeAbilityCategories, oldCats);
    await game.settings.set(constants.systemName, constants.abilityCategories, "");
  }
};

export const crappySplit = (orig: string|null|undefined): string[] => {
  return (orig || "")
    .split(",")
    .map((s: string) => s.trim())
    .filter((s) => s.length > 0);
};

export const migrateToArrays = async () => {
  const toUpdate = [constants.investigativeAbilityCategories,
    constants.generalAbilityCategories,
    constants.combatAbilities,
    constants.shortNotes,
    constants.longNotes];

  for (const key of toUpdate) {
    const setting = game.settings.get(constants.systemName, key);
    if (!Array.isArray(setting)) {
      ui.notifications.info(`Upgrading world setting ${key} to natural array`);
      const parts = crappySplit(setting);
      game.settings.set(constants.systemName, key, parts);
    }
  }
};