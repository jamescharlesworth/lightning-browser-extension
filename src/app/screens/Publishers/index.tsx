import Container from "@components/Container";
import PublishersTable from "@components/PublishersTable";
import Tips from "@components/Tips";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { usePublishers } from "~/app/hooks/usePublishers";
import { useTips } from "~/app/hooks/useTips";

import websites from "./websites.json";

function Publishers() {
  const { t } = useTranslation("translation", {
    keyPrefix: "publishers",
  });

  const { data: publishers = [] } = usePublishers();
  const { tips } = useTips();

  const hasTips = tips.length > 0;

  const navigate = useNavigate();

  function navigateToPublisher(id: number) {
    navigate(`/publishers/${id}`);
  }

  return (
    <Container>
      {(publishers.length > 0 || !hasTips) && (
        <>
          <h2 className="mt-12 mb-2 text-2xl font-bold dark:text-white">
            {t("used.title")}
          </h2>
          <p className="mb-6 text-gray-500 dark:text-neutral-500">
            {t("used.description")}
          </p>

          {publishers.length > 0 ? (
            <PublishersTable
              publishers={publishers}
              navigateToPublisher={navigateToPublisher}
            />
          ) : (
            <p className="dark:text-white"> {t("used.no_info")}</p>
          )}
        </>
      )}
      {publishers.length === 0 && hasTips && (
        <>
          <h2 className="mt-12 mb-2 text-2xl font-bold dark:text-white">
            {t("tips.title")}
          </h2>
          <p className="mb-6 text-gray-500 dark:text-neutral-500">
            {t("tips.description")}
          </p>
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            <Tips />
          </div>
        </>
      )}

      <h2 className="mt-12 mb-2 text-2xl font-bold dark:text-white">
        {t("suggestions.title")}
      </h2>

      <p className="mb-6 text-gray-500 dark:text-neutral-500">
        {t("suggestions.description")}
      </p>

      <div className="mb-12">
        {websites.map(({ title, items }) => (
          <div className="mb-6" key={title}>
            <h4 className="mb-4 text-xl font-bold dark:text-white">
              {t(`suggestions.list.${title as "trading"}`)}
            </h4>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {items.map(({ title, subtitle, logo, url }) => (
                <a key={url} href={url} target="_blank" rel="noreferrer">
                  <div className="bg-white dark:bg-surface-02dp shadow-md flex p-4 h-32 rounded-lg hover:bg-gray-50 cursor-pointer w-full">
                    <div className="flex space-x-3">
                      <img
                        src={logo}
                        alt="image"
                        className="h-14 w-14 rounded-xl shadow-md object-cover"
                      />

                      <div>
                        <h2 className="font-medium font-serif text-base dark:text-white">
                          {title}
                        </h2>

                        <p className="font-serif text-sm font-normal text-gray-500 dark:text-neutral-500 line-clamp-3">
                          {subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

export default Publishers;
