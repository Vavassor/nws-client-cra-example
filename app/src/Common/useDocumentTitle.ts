import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Set the {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/title | document title}.
 */
export const useDocumentTitle = (defaultTitle?: string) => {
  const { t } = useTranslation("");
  const appName = t("mainHeader.appName");
  const [documentTitle, setDocumentTitle] = useState(
    defaultTitle ? `${defaultTitle} • ${appName}` : appName
  );

  useEffect(() => {
    document.title = documentTitle;
  }, [documentTitle]);

  const setTitle = useCallback(
    (newTitle: string | undefined) => {
      setDocumentTitle(newTitle ? `${newTitle} • ${appName}` : appName);
    },
    [appName, setDocumentTitle]
  );

  return { documentTitle, setDocumentTitle: setTitle };
};
