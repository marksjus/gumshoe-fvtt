import { TrailItem } from "../../module/TrailItem";

type PerformAttackArgs1 = {
  spend: string,
  bonusPool: number,
  setSpend: (value: string) => void,
  setBonusPool: (value: number) => void,
  ability: TrailItem,
  damage: number,
}

type PerformAttackArgs2 = {
  description: string,
  rangeDamage: number
}

export const performAttack = ({
  spend,
  ability,
  damage,
  bonusPool,
  setSpend,
  setBonusPool,
}: PerformAttackArgs1) => ({
  description,
  rangeDamage,
}: PerformAttackArgs2) => {
  const hitRoll = new Roll("1d6 + @spend", { spend });
  const hitLabel = `Rolling ${ability.name} at ${description}`;
  hitRoll.roll();
  hitRoll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor: ability.actor }),
    flavor: hitLabel,
  });
  const damageRoll = new Roll("1d6 + @damage + @rangeDamage", {
    spend,
    damage,
    rangeDamage,
  });
  const damageLabel = `Damage at ${description}`;
  damageRoll.roll();
  damageRoll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor: ability.actor }),
    flavor: damageLabel,
  });
  const currentPool = ability.getter("pool")();
  const poolHit = Math.max(0, Number(spend) - bonusPool);
  const newPool = Math.max(0, currentPool - poolHit);
  const newBonusPool = Math.max(0, bonusPool - Number(spend));
  ability.setter("pool")(newPool);
  setBonusPool(newBonusPool);
  setSpend("0");
}
;