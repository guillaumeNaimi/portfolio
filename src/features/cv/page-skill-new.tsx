import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useCanGoBack, useRouter } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { orpc } from 'src/lib/orpc/client';

import { BackButton } from 'src/components/back-button';
import { Form } from 'src/components/form';
import { Button } from 'src/components/ui/button';

import {
  PageLayout,
  PageLayoutContent,
  PageLayoutTopBar,
  PageLayoutTopBarTitle,
} from '@/layout/app/page-layout';

import { FormSkill } from './components/form-skill';
import { SkillForm, zSkillForm } from './schema';

export const PageSkillsNew = () => {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  const form = useForm({
    resolver: zodResolver(zSkillForm()),
    values: {
      technologyId: '',
      level: 0,
    },
  });

  const createSkillMutation = useMutation(
    orpc.cv.createSkill.mutationOptions({
      onSuccess: async () => {
        if (canGoBack) {
          router.history.back({ ignoreBlocker: true });
        } else {
          router.navigate({ to: '..', replace: true, ignoreBlocker: true });
        }
      },
    })
  );

  const onSubmit = (values: SkillForm) => {
    createSkillMutation.mutate(values);
  };

  return (
    <Form {...form} onSubmit={(values) => onSubmit(values)}>
      <PageLayout>
        <PageLayoutTopBar
          leftActions={<BackButton />}
          rightActions={
            <Button size="sm" type="submit" className="min-w-20">
              create
            </Button>
          }
        >
          <PageLayoutTopBarTitle>update skills</PageLayoutTopBarTitle>
        </PageLayoutTopBar>
        <PageLayoutContent>
          <div className="flex flex-col gap-4">
            <FormSkill />
          </div>
        </PageLayoutContent>
      </PageLayout>
    </Form>
  );
};
