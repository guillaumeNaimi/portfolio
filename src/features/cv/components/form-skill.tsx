import { useQuery } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';

import { orpc } from 'src/lib/orpc/client';

import {
  FormField,
  FormFieldController,
  FormFieldLabel,
} from 'src/components/form';

import { SkillForm } from '../schema';

export const FormSkill = () => {
  const form = useFormContext<SkillForm>();

  const skillsQuery = useQuery(orpc.cv.getSkills.queryOptions());
  const usedTechnologies =
    skillsQuery.data?.map((skill) => skill.technology.id) ?? [];

  const technologiesQuery = useQuery(orpc.cv.getTechnologies.queryOptions());
  const availableTechnologies =
    technologiesQuery.data?.filter(
      (technology) => !usedTechnologies.includes(technology.id)
    ) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <FormField>
        <FormFieldLabel>Technology</FormFieldLabel>
        <FormFieldController
          type="select"
          options={availableTechnologies.map((technology) => ({
            id: technology.id,
            label: technology.name,
          }))}
          control={form.control}
          name="technologyId"
          autoFocus
        />
      </FormField>
      <FormField>
        <FormFieldLabel>Level</FormFieldLabel>
        <FormFieldController
          type="number"
          control={form.control}
          name="level"
        />
      </FormField>
    </div>
  );
};
