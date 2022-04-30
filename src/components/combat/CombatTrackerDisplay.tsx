/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { ReactNode, useEffect, useState } from "react";
import { InvestigatorCombatTrackerBase } from "../../module/InvestigatorCombatTracker";
import { TextInput } from "../inputs/TextInput";

interface CombatTrackerProps {
  app: InvestigatorCombatTrackerBase;
}

export const CombatTrackerDisplay: React.FC<CombatTrackerProps> = ({
  app,
}: CombatTrackerProps) => {
  const [data, setData] = useState<CombatTracker.Data|null>(null);

  useEffect(() => {
    (async () => {
      const data = await app.getData();
      setData(data);
    })();
  }, [app]);

  const [x, setX] = useState("");

  return (
    <div>
      Combat Tracker
      {
        data?.combat?.combatants.map<ReactNode>((c) => {
          return <div key={c.data._id}>{c.actor?.data.name}</div>;
        })
      }
      <TextInput value={x} onChange={setX} />
    </div>
  );
};