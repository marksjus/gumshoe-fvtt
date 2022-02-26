import { pc } from "../constants";
import { escape } from "html-escaper";
import * as constants from "../constants";

export const moveOldNotesToNewNoteSlots = (data: any, updateData: any) => {
  if (data.type === pc) {
    const hasOldNotes = !!(
      data.data.drive ||
      data.data.occupationalBenefits ||
      data.data.pillarsOfSanity ||
      data.data.sourcesOfStability ||
      data.data.notes ||
      data.data.background
    );

    if (hasOldNotes) {
      if (!updateData.data) {
        updateData.data = {};
      }
      updateData.data.shortNotes = [
        data.data.drive || "",
      ];
      updateData.data.longNotes = [
        data.data.occupationalBenefits || "",
        data.data.pillarsOfSanity || "",
        data.data.sourcesOfStability || "",
        data.data.notes || "",
        data.data.background || "",
      ];
      updateData.data.drive = null;
      updateData.data.occupationalBenefits = null;
      updateData.data.pillarsOfSanity = null;
      updateData.data.sourcesOfStability = null;
      updateData.data.notes = null;
      updateData.data.background = null;
    }
  }
  return updateData;
};

export const upgradeLongNotesToRichText = (data: any, updateData: any) => {
  let updateNeeded = false;
  if (data.type === constants.pc) {
    const newLongNotes: any[] = [];
    for (const note of data.data.longNotes) {
      if (typeof note === "string") {
        updateNeeded = true;
        newLongNotes.push({
          format: "plain",
          source: note,
          html: escape(note),
        });
      } else {
        newLongNotes.push(note);
      }
    }
    if (updateNeeded) {
      if (!updateData.data) {
        updateData.data = {};
      }
      updateData.data.longNotesFormat = "plain";
      updateData.data.longNotes = newLongNotes;
    }
  }
  if (data.type === constants.npc) {
    if (typeof data.data.notes === "string") {
      if (!updateData.data) {
        updateData.data = {};
      }
      updateData.data.notes = {
        format: "plain",
        source: data.data.notes,
        html: escape(data.data.notes),
      };
    }
  }
  return updateData;
};