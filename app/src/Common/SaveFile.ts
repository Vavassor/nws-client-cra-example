import { saveAs } from "file-saver";

export const saveTextFile = (fileContents: string, filename?: string) => {
  const blob = new Blob([fileContents], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, filename);
};
