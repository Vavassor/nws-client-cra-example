import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Skeleton,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getGlossary } from "@vavassor/nws-client";
import { FC, Fragment, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Link as RouterLink,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { sanitizeId } from "../Common/ElementId";

interface FormValues {
  search: string;
}

export const GlossarySection: FC = () => {
  const { data: glossary, isLoading } = useQuery(["glossary"], () =>
    getGlossary({})
  );
  const { t } = useTranslation("glossary");
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
  const { hash } = useLocation();

  const onSubmit = handleSubmit((values) => {
    setUrlSearchParams(values.search ? { query: values.search } : undefined);
  });

  const filteredDefinitions = useMemo(
    () =>
      glossary?.glossary.filter((definition) => {
        const query = urlSearchParams.get("query");
        return query
          ? definition.term
              .toLocaleLowerCase()
              .includes(query.toLocaleLowerCase())
          : true;
      }),
    [glossary, urlSearchParams]
  );

  useEffect(() => {
    if (glossary) {
      const element = document.getElementById(hash.slice(1));
      element?.scrollIntoView(true);
    }
  }, [glossary, hash]);

  return (
    <Box as="section" borderRadius="lg" borderWidth="1px" px={8} py={4}>
      <Heading as="h1" size="lg">
        {t("glossarySection.heading")}
      </Heading>
      <form onSubmit={onSubmit}>
        <FormControl isInvalid={!!errors.search}>
          <FormLabel>{t("glossarySection.searchFieldLabel")}</FormLabel>
          <Input {...register("search")} />
          <FormErrorMessage>
            {errors.search && errors.search.message}
          </FormErrorMessage>
        </FormControl>
        <Button isLoading={isSubmitting} mt={4} type="submit">
          {t("glossarySection.submitButtonLabel")}
        </Button>
      </form>
      {filteredDefinitions && filteredDefinitions.length > 0 ? (
        <dl>
          {filteredDefinitions.map((definition) => {
            const id = `${sanitizeId(definition.term)}-${
              definition.definition.length
            }`;
            return (
              <Fragment key={id}>
                <Text as="dt" data-group fontWeight="semibold" id={id} mt={4}>
                  {definition.term}
                  <Link
                    aria-label={t("glossarySection.termLink")}
                    as={RouterLink}
                    _groupHover={{ opacity: 1 }}
                    opacity={0}
                    to={`#${id}`}
                  >
                    #
                  </Link>
                </Text>
                <dd
                  dangerouslySetInnerHTML={{ __html: definition.definition }}
                />
              </Fragment>
            );
          })}
        </dl>
      ) : isLoading ? (
        <>
          <Skeleton height="20px" mt={4} />
          <SkeletonText noOfLines={4} spacing="4" />
        </>
      ) : (
        <Text mb={6} mt={8}>
          {t("glossarySection.noResultsMessage")}
        </Text>
      )}
    </Box>
  );
};
