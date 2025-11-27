import type { Meta } from '@storybook/react-vite';

import { Button } from 'src/components/ui/button';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from 'src/components/ui/drawer';

export default {
  title: 'Drawer',
} satisfies Meta<typeof Drawer>;

export const Default = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">Open</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Title</DrawerTitle>
          <DrawerDescription>Description</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>Content</DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
