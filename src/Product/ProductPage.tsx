import { Box, Button, Container, Heading, Text } from "@chakra-ui/react";
import { SkipNavContent } from "@chakra-ui/skip-nav";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@vavassor/nws-client";
import { FC, useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { saveTextFile } from "../Common/SaveFile";
import { useDocumentTitle } from "../Common/useDocumentTitle";

export const ProductPage: FC = () => {
  const { productId } = useParams();
  const { data: product } = useQuery(
    ["product", productId],
    () => getProduct({ productId: productId! }),
    {
      enabled: !!productId,
    }
  );
  const { t } = useTranslation("product");
  const { setDocumentTitle } = useDocumentTitle();

  const handleClickCopy = () => {
    if (product?.productText) {
      navigator.clipboard.writeText(product.productText);
    }
  };

  const handleClickPrint = () => {
    window.print();
  };

  const handleClickDownload = () => {
    if (product?.productText) {
      saveTextFile(product.productText, `${product.productName}.txt`);
    }
  };

  useEffect(() => {
    if (product) {
      setDocumentTitle(product.productName);
    }
  }, [product, setDocumentTitle]);

  return (
    <Container as="main" maxW="container.sm" pt={4}>
      <SkipNavContent />
      {!!product && (
        <>
          <Heading as="h1" pt={4} size="lg">
            {product.productName}
          </Heading>
          <Text>
            <Trans i18nKey="productPage.issuedByMessage" t={t}>
              Issued by {{ issuingOffice: product.issuingOffice }} on{" "}
              <time dateTime={product.issuanceTime}>
                {
                  {
                    formatParams: {
                      issuanceTime: {
                        dateStyle: "long",
                        timeStyle: "long",
                      },
                    },
                    issuanceTime: new Date(product.issuanceTime),
                  } as any
                }
              </time>
              .
            </Trans>
          </Text>
          <Box mt={8}>
            <Button onClick={handleClickCopy}>
              {t("productPage.copyTextButtonLabel")}
            </Button>
            <Button ms={2} onClick={handleClickDownload}>
              {t("productPage.downloadButtonLabel")}
            </Button>
            <Button ms={2} onClick={handleClickPrint}>
              {t("productPage.printButtonLabel")}
            </Button>
          </Box>
          <Text as="pre" mt={4} overflowX="auto">
            {product.productText}
          </Text>
        </>
      )}
    </Container>
  );
};
