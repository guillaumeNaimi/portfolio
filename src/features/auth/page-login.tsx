import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { envClient } from "@/env/client";
import { authClient } from "@/features/auth/client";

const I18N_KEY_PAGE_PREFIX = "auth:pageLogin" as const;

export default function PageLogin({
  search,
}: {
  search: { redirect?: string };
}) {
  const { t } = useTranslation(["auth", "common"]);
  const social = useMutation({
    mutationFn: async (
      provider: Parameters<typeof authClient.signIn.social>[0]["provider"],
    ) => {
      const response = await authClient.signIn.social({
        provider,
        callbackURL: search.redirect ?? "/",
        errorCallbackURL: "/login/error",
      });
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          {t(`${I18N_KEY_PAGE_PREFIX}.title`)}
        </h1>
        <p className="text-sm text-balance text-muted-foreground">
          {t(`${I18N_KEY_PAGE_PREFIX}.description`)}
        </p>
      </div>
      <Button
        className="w-full"
        variant="secondary"
        disabled={envClient.VITE_IS_DEMO}
        loading={
          social.variables === "github" &&
          (social.isPending || social.isSuccess)
        }
        size="lg"
        onClick={() => social.mutate("github")}
      >
        {t(`${I18N_KEY_PAGE_PREFIX}.loginWithSocial`, { provider: "GitHub" })}
      </Button>
    </>
  );
}
